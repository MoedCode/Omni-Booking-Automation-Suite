# gui/theme.py
# --- Theme Palettes ---

DARK_THEME = {
    "main_bg": "#0B0F17",
    "dialog_bg": "#060c1a",
    "text_primary": "#94A3B8",
    "text_secondary": "#E2E8F0",
    "input_bg": "#0F1420",
    "input_border": "#334155",
    "input_focus_border": "#4F46E5",
    "button_bg": "#334155",
    "button_hover_bg": "#475569",
    "button_pressed_bg": "#1E293B",
    "table_bg": "#121824",
    "table_grid": "#1E293B",
    "header_bg": "#1E293B",
    "selection_bg": "#334155",
    "selection_text": "#F1F5F9",
    "group_border": "rgba(99,102,241,0.2)",
    "switch_bg": "rgba(255,255,255,0.08)",
    "switch_checked_bg": "qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #10b981, stop:1 #34d399)",
    "pill_tgt_bg": "rgba(16,185,129,0.15)",
    "pill_tgt_text": "#34D399",
    "pill_max_bg": "rgba(251,191,36,0.15)",
    "pill_max_text": "#FBBF24",
    "pill_shw_text": "#67E8F9",
    "pill_cur_text": "#F0ABFC",
    "month_btn_bg": "rgba(6,12,26,0.8)",
    "month_btn_text": "#64748B",
    "month_btn_checked_bg": "qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0 #10b981, stop:1 #059669)",
    "month_btn_checked_text": "white",
    "month_btn_checked_border": "#34d399",
    "set_btn_bg": "#F59E0B",
    "set_btn_text": "white",
    "pass_toggle_text": "#94A3B8",
    "label_style_text": "#475569",
}

LIGHT_THEME = {
    "main_bg": "#F8FAFC",
    "dialog_bg": "#FFFFFF",
    "text_primary": "#475569",
    "text_secondary": "#0F172A",
    "input_bg": "#FFFFFF",
    "input_border": "#CBD5E1",
    "input_focus_border": "#4338CA",
    "button_bg": "#E2E8F0",
    "button_hover_bg": "#F1F5F9",
    "button_pressed_bg": "#CBD5E1",
    "table_bg": "#FFFFFF",
    "table_grid": "#F1F5F9",
    "header_bg": "#F1F5F9",
    "selection_bg": "#DBEAFE",
    "selection_text": "#1E3A8A",
    "group_border": "#E2E8F0",
    "switch_bg": "#E2E8F0",
    "switch_checked_bg": "#2563EB",
    "pill_tgt_bg": "#D1FAE5",
    "pill_tgt_text": "#065F46",
    "pill_max_bg": "#FEF3C7",
    "pill_max_text": "#92400E",
    "pill_shw_text": "#0E7490",
    "pill_cur_text": "#86198F",
    "month_btn_bg": "#F1F5F9",
    "month_btn_text": "#64748B",
    "month_btn_checked_bg": "#2563EB",
    "month_btn_checked_text": "white",
    "month_btn_checked_border": "#60A5FA",
    "set_btn_bg": "#F97316",
    "set_btn_text": "white",
    "pass_toggle_text": "#64748B",
    "label_style_text": "#64748B",
}

def get_main_stylesheet(theme: str) -> str:
    """Generates the main QSS for the application based on the selected theme."""
    p = DARK_THEME if theme == 'dark' else LIGHT_THEME
    
    return f"""
    /* Main Window, Dialogs, and Central Widget explicitly targeted */
    QMainWindow, QDialog, QWidget#central_widget {{
        background-color: {p['main_bg']};
    }}

    /* Labels */
    QLabel {{
        color: {p['text_primary']};
        font-size: 14px;
    }}

    /* Input Fields */
    QLineEdit {{
        background-color: {p['input_bg']};
        color: {p['text_secondary']};
        border: 1px solid {p['input_border']};
        border-radius: 4px;
        padding: 8px;
        font-size: 14px;
        min-height: 25px;
    }}
    QLineEdit:focus {{
        border-color: {p['input_focus_border']};
    }}

    /* Standard Buttons */
    QPushButton {{
        background-color: {p['button_bg']};
        color: {p['text_secondary']};
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: bold;
    }}
    QPushButton:hover {{
        background-color: {p['button_hover_bg']};
    }}
    QPushButton:pressed {{
        background-color: {p['button_pressed_bg']};
    }}

    /* Primary Action Button (Deploy) */
    QPushButton#deployButton {{
        background-color: #2563EB; 
        color: white;
    }}
    QPushButton#deployButton:hover {{
        background-color: #3B82F6;
    }}

    /* Destructive Action Button (Terminate Suite) */
    QPushButton#terminateSuiteButton {{
        background-color: #991B1B; 
        color: white;
    }}
    QPushButton#terminateSuiteButton:hover {{
        background-color: #B91C1C;
    }}

    /* Table Widget */
    QTableWidget {{
        background-color: {p['table_bg']};
        color: {p['text_primary']};
        border: 1px solid {p['input_border']};
        gridline-color: {p['table_grid']};
        font-size: 13px;
    }}

    /* Table Header */
    QHeaderView::section {{
        background-color: {p['header_bg']};
        color: {p['text_primary']};
        padding: 8px;
        border: 1px solid {p['input_border']};
        font-weight: bold;
    }}

    /* Table Cells */
    QTableWidget::item {{
        padding: 8px;
        border-bottom: 1px solid {p['table_grid']};
    }}
    QTableWidget::item:selected {{
        background-color: {p['selection_bg']};
        color: {p['selection_text']};
    }}
    """