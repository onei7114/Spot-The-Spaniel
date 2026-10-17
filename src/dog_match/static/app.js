"use strict";

const form = document.querySelector("#upload-form");
const fileInput = document.querySelector("#dog-photo");
const submitButton = document.querySelector("#submit-button");
const loadingMessage = document.querySelector("#loading-message");
const errorMessage = document.querySelector("#error-message");
const resultPanel = document.querySelector("#result-panel");
const breedName = document.querySelector("#breed-name");
const similarityScore = document.querySelector("#similarity-score");
const resultDisclaimer = document.querySelector("#result-disclaimer");
const referenceImages = document.querySelector("#reference-images");
const referenceImage = document.querySelector("#reference-image");
const secondaryPrediction = document.querySelector("#secondary-prediction");
const spanielModelId = "YfNmBnU00";
const minimumConfidence = 0.50;
const minimumPredictionMargin = 0.10;

let spanielModelPromise;
let galleryPromise;

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  resultPanel.hidden = true;
}

function clearResult() {
  resultPanel.hidden = true;
  referenceImages.replaceChildren(referenceImage);
  referenceImage.removeAttribute("src");
  breedName.textContent = "";
  secondaryPrediction.textContent = "";
  similarityScore.textContent = "";
  resultDisclaimer.textContent = "";
}

function normalizeBreedName(name) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function loadGallery() {
  if (!galleryPromise) {
    galleryPromise = fetch("/static/gallery-manifest.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("The representative breed gallery could not be loaded.");
        }
        return response.json();
      });
  }
  return galleryPromise;
}

function findGalleryPhoto(breedName, gallery) {
  const normalized = normalizeBreedName(breedName);
  const exact = gallery.find((entry) => normalizeBreedName(entry.breedName) === normalized);
  if (exact) {
    return exact;
  }
  const withoutDog = normalized.replace(/dog$/, "");
  return gallery.find((entry) => {
    const candidate = normalizeBreedName(entry.breedName);
    return candidate === withoutDog || candidate.replace(/dog$/, "") === withoutDog;
  }) || null;
}

function loadSpanielModel() {
  if (!spanielModelPromise) {
    if (!window.tmImage) {
      spanielModelPromise = Promise.reject(new Error("The breed model library did not load."));
    } else {
      const baseUrl = `https://teachablemachine.withgoogle.com/models/${spanielModelId}/`;
      spanielModelPromise = window.tmImage.load(
        `${baseUrl}model.json`,
        `${baseUrl}metadata.json`
      );
    }
  }
  return spanielModelPromise;
}

async function predictAcrossModels(file) {
  const [spanielModel, gallery] = await Promise.all([loadSpanielModel(), loadGallery()]);
  const image = document.createElement("img");
  const objectUrl = URL.createObjectURL(file);
  image.src = objectUrl;
  try {
    await image.decode();
    const predictions = await spanielModel.predict(image);
    const notDogPrediction = predictions.find(
      (prediction) => prediction.className.trim().toLowerCase() === "not a dog"
    );
    const breedPredictions = predictions
      .filter((prediction) => prediction !== notDogPrediction)
      .sort((left, right) => right.probability - left.probability);
    const best = breedPredictions[0];
    const secondBest = breedPredictions[1];
    const tiedPredictions = best
      ? breedPredictions.filter(
        (prediction) => Math.abs(prediction.probability - best.probability) < 0.000001
      )
      : [];
    const hasTie = tiedPredictions.length > 1;
    if (
      !best ||
      !secondBest ||
      !notDogPrediction ||
      notDogPrediction.probability >= best.probability ||
      best.probability < minimumConfidence ||
      (!hasTie && best.probability - secondBest.probability < minimumPredictionMargin)
    ) {
      throw new Error(
        "No confident spaniel match was found. Please submit a clearer spaniel photo."
      );
    }
    const galleryPhotos = tiedPredictions.map((prediction) => ({
      prediction,
      photo: findGalleryPhoto(prediction.className, gallery),
    }));
    const missingPhoto = galleryPhotos.find((entry) => !entry.photo);
    if (missingPhoto) {
      throw new Error(`No representative photo is available for ${missingPhoto.prediction.className}.`);
    }
    return { best, tiedPredictions, galleryPhotos, modelCount: 1 };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.hidden = true;
  clearResult();

  const file = fileInput.files && fileInput.files[0];
  if (!file) {
    showError("Choose a JPG or JPEG photo before continuing.");
    fileInput.focus();
    return;
  }
  if (!/^image\/jpeg$/i.test(file.type) && !/\.jpe?g$/i.test(file.name)) {
    showError("Choose a JPG or JPEG photo and try again.");
    fileInput.focus();
    return;
  }

  submitButton.disabled = true;
  loadingMessage.hidden = false;
  try {
    const result = await predictAcrossModels(file);
    breedName.textContent = result.tiedPredictions.map((prediction) => prediction.className).join(" / ");
    secondaryPrediction.textContent =
      result.tiedPredictions.length > 1
        ? "These breeds are tied for the highest confidence."
        : "Compared against the spaniel breed model, including its Not A Dog class.";
    similarityScore.textContent = `${Math.round(result.best.probability * 100)}%`;
    resultDisclaimer.textContent =
      "This is a model confidence score, not a guaranteed breed identification.";
    result.galleryPhotos.forEach(({ prediction, photo }, index) => {
      const image = index === 0
        ? referenceImage
        : referenceImage.cloneNode();
      image.alt = `Representative photo for ${prediction.className}`;
      image.src = photo.imageUrl;
      image.onerror = () => {
        clearResult();
        showError("A representative breed photo could not be displayed. Please try again.");
      };
      if (index > 0) {
        referenceImages.append(image);
      }
    });
    resultPanel.hidden = false;
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "The breed models could not process this photo. Please try again.";
    showError(message);
  } finally {
    loadingMessage.hidden = true;
    submitButton.disabled = false;
  }
});
