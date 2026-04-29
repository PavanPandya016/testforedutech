"""
Frontend Metrics Bar Charts — Load-Test Summary Style (Improved)
Generates two charts styled like a modern dashboard with premium cards:
  1. Lighthouse Audit  — Performance, Accessibility, Best Practices, SEO
  2. Network Metrics   — Requests, Page Size, Load Time

Requirements:
    pip install matplotlib numpy
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from matplotlib.patches import FancyBboxPatch

# ── Data ─────────────────────────────────────────────────────────────────────

lighthouse = {
    "categories": ["Performance", "Accessibility", "Best Practices", "SEO"],
    "old":        [32,            88,               95,               82],
    "new":        [70,            96,               100,              100],
}

network = {
    "categories": ["Requests",   "Page Size (MB)", "Load Time (s)"],
    "old":        [74,            10.7,              4.16],
    "new":        [29,            1.2,               2.61],
    "units":      ["",            " MB",             " s"],
}

# ── Palette (Premium Modern Dashboard) ───────────────────────────────────────

BG         = "#FFFFFF"
CARD_BG    = "#F8F9FA"  # Slightly lighter/cleaner
CARD_BORDER = "#E9ECEF"
GRID_COL   = "#F1F3F5"
TEXT_TITLE = "#212529"
TEXT_SUB   = "#6C757D"
TEXT_AXIS  = "#ADB5BD"
OLD_BAR    = "#343A40"  # Darker charcoal
NEW_BAR    = "#E03131"  # Vibrant Red
OLD_LABEL  = "#495057"
NEW_LABEL  = "#C92A2A"
SUCCESS_UP = "#2F9E44"  # For improvements

# ── Shared helpers ────────────────────────────────────────────────────────────

def draw_card(fig, left, bottom, width, height, label, value_str, val_color, trend_up=True):
    """
    Draws a premium dashboard card with rounded corners, subtle shadows,
    and clear visual hierarchy.
    """
    # Create axis for the card
    ax_c = fig.add_axes([left, bottom, width, height])
    ax_c.set_xlim(0, 1)
    ax_c.set_ylim(0, 1)
    ax_c.axis("off")

    # 1. Subtle Shadow (Bottom Layer)
    shadow = FancyBboxPatch((0.01, -0.01), 0.98, 0.98,
                            boxstyle="round,pad=0.0,rounding_size=0.1",
                            facecolor="#000000", alpha=0.03,
                            transform=ax_c.transAxes, clip_on=False)
    ax_c.add_patch(shadow)

    # 2. Main Card Body
    rect = FancyBboxPatch((0, 0), 1, 1,
                          boxstyle="round,pad=0.0,rounding_size=0.1",
                          facecolor=CARD_BG, edgecolor=CARD_BORDER, linewidth=1,
                          transform=ax_c.transAxes, clip_on=False)
    ax_c.add_patch(rect)

    # 3. Label (Top Left)
    ax_c.text(0.1, 0.82, label.upper(), fontsize=7.5, color=TEXT_SUB,
              fontweight="bold", va="top", transform=ax_c.transAxes)

    # 4. Values (Comparison)
    if "→" in value_str:
        parts = value_str.split("→")
        old_val = parts[0].strip()
        new_val = parts[1].strip()

        # Old Value (Muted)
        old_fs = 10 if "MB" in value_str else 11
        ax_c.text(0.1, 0.42, old_val, fontsize=old_fs, 
                  color=TEXT_AXIS, fontweight="500", va="center", transform=ax_c.transAxes)
        
        # Arrow Icon
        ax_c.text(0.32 if len(old_val) < 4 else 0.38, 0.42, "→", fontsize=11, color=TEXT_AXIS,
                  va="center", transform=ax_c.transAxes)

        # New Value (Bold & Prominent)
        ax_c.text(0.48 if len(old_val) < 4 else 0.54, 0.42, new_val, fontsize=19, color=val_color,
                  fontweight="bold", va="center", transform=ax_c.transAxes)
        
        # Optional Trend Indicator (Small dot)
        indicator_color = SUCCESS_UP if trend_up else NEW_BAR
        circle = plt.Circle((0.06, 0.42), 0.015, color=indicator_color, 
                            transform=ax_c.transAxes, alpha=0.6)
        ax_c.add_patch(circle)
    else:
        # Single Value Layout
        ax_c.text(0.1, 0.42, value_str, fontsize=19, color=val_color,
                  fontweight="bold", va="center", transform=ax_c.transAxes)

def style_chart_ax(ax, ylabel):
    ax.set_facecolor(BG)
    ax.set_ylabel(ylabel, fontsize=9, color=TEXT_SUB, fontweight="500")
    ax.yaxis.grid(True, color=GRID_COL, linewidth=1, zorder=0)
    ax.set_axisbelow(True)
    ax.spines[["top", "right", "left"]].set_visible(False)
    ax.spines["bottom"].set_color(CARD_BORDER)
    ax.tick_params(colors=TEXT_SUB, length=0, labelsize=9)
    ax.yaxis.set_tick_params(labelcolor=TEXT_SUB)

def bar_labels(ax, bars, values, color, ylim, suffix=""):
    for bar, val in zip(bars, values):
        if val == 0:
            continue
        ax.text(bar.get_x() + bar.get_width() / 2,
                val + ylim * 0.02,
                f"{val}{suffix}",
                ha="center", va="bottom",
                fontsize=9, fontweight="bold", color=color)

# ═══════════════════════════════════════════════════════════════════════════════
#  CHART 1 — Lighthouse Audit
# ═══════════════════════════════════════════════════════════════════════════════

fig1 = plt.figure(figsize=(11, 7), facecolor=BG)
fig1.text(0.04, 0.96, "Lighthouse Audit", fontsize=16,
          fontweight="bold", color=TEXT_TITLE, va="top")
fig1.text(0.04, 0.92, "Performance comparison before and after optimization", 
          fontsize=9.5, color=TEXT_SUB, va="top")

# Cards
card_w, card_h = 0.22, 0.14
card_gap = 0.02
for i, (lbl, val, col) in enumerate([
    ("Performance",    "32 → 70",  TEXT_TITLE),
    ("Accessibility",  "88 → 96",  TEXT_TITLE),
    ("Best Practices", "95 → 100", NEW_LABEL),
    ("SEO",            "82 → 100", NEW_LABEL),
]):
    draw_card(fig1, 0.04 + i*(card_w+card_gap), 0.74, card_w, card_h, lbl, val, col)

# Bar chart
ax1 = fig1.add_axes([0.08, 0.1, 0.88, 0.58])
x1  = np.arange(len(lighthouse["categories"]))
w   = 0.32
ylim1 = 120

b1o = ax1.bar(x1 - w/2, lighthouse["old"], w, color=OLD_BAR, zorder=3, 
              label="Old Version", alpha=0.85)
b1n = ax1.bar(x1 + w/2, lighthouse["new"], w, color=NEW_BAR, zorder=3, 
              label="Optimized Version")

bar_labels(ax1, b1o, lighthouse["old"], OLD_LABEL, ylim1)
bar_labels(ax1, b1n, lighthouse["new"], NEW_LABEL, ylim1)

ax1.set_xticks(x1)
ax1.set_xticklabels(lighthouse["categories"], fontsize=10, color=TEXT_TITLE, fontweight="500")
ax1.set_ylim(0, ylim1)
ax1.set_yticks(range(0, 101, 20))
style_chart_ax(ax1, "Score (0 – 100)")

# Custom Legend
old_p = mpatches.Patch(color=OLD_BAR, label="Old Version")
new_p = mpatches.Patch(color=NEW_BAR, label="Optimized Version")
ax1.legend(handles=[old_p, new_p], fontsize=9, frameon=False,
           loc="upper right", handlelength=1.2, labelcolor=TEXT_SUB)

plt.savefig("lighthouse_audit_premium.png", dpi=300, bbox_inches="tight")
print("Saved → lighthouse_audit_premium.png")


# ═══════════════════════════════════════════════════════════════════════════════
#  CHART 2 — Network Metrics
# ═══════════════════════════════════════════════════════════════════════════════

fig2 = plt.figure(figsize=(11, 7), facecolor=BG)
fig2.text(0.04, 0.96, "Network Performance", fontsize=16,
          fontweight="bold", color=TEXT_TITLE, va="top")
fig2.text(0.04, 0.92, "Resource loading and response times analysis", 
          fontsize=9.5, color=TEXT_SUB, va="top")

# Cards
for i, (lbl, val, col, trend) in enumerate([
    ("Requests",       "74 → 29",       TEXT_TITLE, True),
    ("Page Size",      "10.7 → 1.2 MB", NEW_LABEL,  True),
    ("Load Time",      "4.16 → 2.61 s", TEXT_TITLE, True),
    ("Efficiency",     "−89%",           NEW_LABEL,  True),
]):
    draw_card(fig2, 0.04 + i*(card_w+card_gap), 0.74, card_w, card_h, lbl, val, col, trend)

# Bar chart
ax2   = fig2.add_axes([0.08, 0.1, 0.88, 0.58])
cats2 = network["categories"]
old2  = network["old"]
new2  = network["new"]
units = network["units"]
x2    = np.arange(len(cats2))
ylim2 = 90

b2o = ax2.bar(x2 - w/2, old2, w, color=OLD_BAR, zorder=3, alpha=0.85)
b2n = ax2.bar(x2 + w/2, new2, w, color=NEW_BAR, zorder=3)

for bar, val, unit in zip(b2o, old2, units):
    ax2.text(bar.get_x() + bar.get_width() / 2,
             val + ylim2 * 0.02, f"{val}{unit}",
             ha="center", va="bottom", fontsize=9,
             fontweight="bold", color=OLD_LABEL)

for bar, val, unit in zip(b2n, new2, units):
    ax2.text(bar.get_x() + bar.get_width() / 2,
             val + ylim2 * 0.02, f"{val}{unit}",
             ha="center", va="bottom", fontsize=9,
             fontweight="bold", color=NEW_LABEL)

ax2.set_xticks(x2)
ax2.set_xticklabels(cats2, fontsize=10, color=TEXT_TITLE, fontweight="500")
ax2.set_ylim(0, ylim2)
style_chart_ax(ax2, "Metrics Value")
ax2.legend(handles=[old_p, new_p], fontsize=9, frameon=False,
           loc="upper right", handlelength=1.2, labelcolor=TEXT_SUB)

plt.savefig("network_metrics_premium.png", dpi=300, bbox_inches="tight")
print("Saved → network_metrics_premium.png")

plt.show()
