from __future__ import annotations

def clamp(value: float, min_value: float = 0.0, max_value: float = 100.0) -> float:
    return max(min_value, min(value, max_value))


def round_score(value: float) -> float:
    return round(clamp(value), 2)

