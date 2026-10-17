"""Deterministic nearest-reference ranking and display-score conversion."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np
from numpy.typing import NDArray

from dog_match.index import ReferenceIndex


@dataclass(frozen=True, slots=True)
class MatchResult:
    reference_id: str
    breed_name: str
    similarity_percent: int
    cosine_similarity: float


def cosine_to_percent(cosine_similarity: float) -> int:
    """Map cosine similarity from [-1, 1] to a display-only integer [1, 100]."""
    if not np.isfinite(cosine_similarity):
        raise ValueError("Cosine similarity must be finite")
    bounded = min(1.0, max(-1.0, cosine_similarity))
    score = round(1 + ((bounded + 1) / 2) * 99)
    return min(100, max(1, int(score)))


def find_closest_reference(
    index: ReferenceIndex,
    uploaded_vector: NDArray[np.floating[Any]],
    exclude_reference_id: str | None = None,
) -> MatchResult:
    """Return the strongest folder match and its best representative photo.

    Folder scores use the mean of the five strongest photo similarities in each
    folder. This compares the complete reference collection while reducing the
    effect of one unusually close or poor photo.
    """
    vectors = index.embeddings
    query = np.asarray(uploaded_vector, dtype=np.float32).reshape(-1)
    if vectors.ndim != 2 or not index.manifest.images:
        raise ValueError("Reference index is empty or malformed")
    if query.size != vectors.shape[1]:
        raise ValueError("Uploaded image vector does not match the reference model dimensions")
    if not np.isfinite(query).all():
        raise ValueError("Uploaded image vector contains non-finite values")
    query_norm = float(np.linalg.norm(query))
    if query_norm == 0.0:
        raise ValueError("Uploaded image vector has zero length")
    if vectors.shape[0] != len(index.manifest.images):
        raise ValueError("Reference index rows do not align with image records")

    normalized_query = query / query_norm
    scores = np.asarray(vectors @ normalized_query, dtype=np.float32)
    if not np.isfinite(scores).all():
        raise ValueError("Similarity calculation returned a non-finite score")
    if exclude_reference_id is not None:
        excluded_positions = [
            position
            for position, image in enumerate(index.manifest.images)
            if image.reference_id == exclude_reference_id
        ]
        if not excluded_positions:
            raise ValueError("Excluded reference image is not present in this index")
        scores[excluded_positions] = -np.inf
    grouped_positions: dict[str, list[int]] = {}
    for position, photo in enumerate(index.manifest.images):
        if np.isfinite(scores[position]):
            grouped_positions.setdefault(photo.breed_name, []).append(position)
    if not grouped_positions:
        raise ValueError("No reference images remain after exclusions")

    folder_scores = {
        folder_name: float(
            np.mean(
                sorted(
                    (float(scores[position]) for position in positions),
                    reverse=True,
                )[:5]
            )
        )
        for folder_name, positions in grouped_positions.items()
    }
    best_folder = min(
        folder_scores,
        key=lambda folder_name: (-folder_scores[folder_name], folder_name),
    )
    best_folder_positions = grouped_positions[best_folder]
    best_position = min(
        best_folder_positions,
        key=lambda position: (
            -float(scores[position]),
            index.manifest.images[position].relative_path,
        ),
    )
    photo = index.manifest.images[best_position]
    folder_score = folder_scores[best_folder]
    return MatchResult(
        reference_id=photo.reference_id,
        breed_name=photo.breed_name,
        similarity_percent=cosine_to_percent(folder_score),
        cosine_similarity=folder_score,
    )
