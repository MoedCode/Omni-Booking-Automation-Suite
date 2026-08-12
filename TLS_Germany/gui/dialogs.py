"""
Contains all QDialog-based pop-up windows for the application.
"""
from PyQt6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, QLineEdit, 
    QMessageBox, QComboBox, QGridLayout, QGroupBox, QCheckBox
)
from PyQt6.QtCore import Qt, QTimer
import datetime
from browsers.chrome import ChromeManager

class AddInstanceDialog(QDialog):
    """A dialog to manually add a new bot instance."""
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Add New Instance")
        self.setModal(True)
        self.setFixedSize(400, 350)

        self.account = ""
        self.password = ""
        self.selected_month = ""
        self.selected_year = ""
        self.selected_city = ""
        
        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(10)

        layout.addWidget(QLabel("Account (Email):"))
        self.account_edit = QLineEdit()
        self.account_edit.setPlaceholderText("Enter account email")
        layout.addWidget(self.account_edit)

        layout.addWidget(QLabel("Password:"))
        self.password_edit = QLineEdit()
        self.password_edit.setPlaceholderText("Enter account password")
        self.password_edit.setEchoMode(QLineEdit.EchoMode.Password)
        layout.addWidget(self.password_edit)

        layout.addWidget(QLabel("Target City:"))
        self.city_edit = QLineEdit()
        self.city_edit.setPlaceholderText("e.g., Alexandria")
        layout.addWidget(self.city_edit)

        month_year_layout = QHBoxLayout()
        
        month_layout = QVBoxLayout()
        month_layout.addWidget(QLabel("Month:"))
        self.month_combo = QComboBox()
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        self.month_combo.addItems(months)
        self.month_combo.setCurrentText(datetime.datetime.now().strftime("%B"))
        month_layout.addWidget(self.month_combo)
        month_year_layout.addLayout(month_layout)

        year_layout = QVBoxLayout()
        year_layout.addWidget(QLabel("Year:"))
        self.year_combo = QComboBox()
        years = [str(y) for y in range(2024, 2031)]
        self.year_combo.addItems(years)
        self.year_combo.setCurrentText("2026")
        year_layout.addWidget(self.year_combo)
        month_year_layout.addLayout(year_layout)

        layout.addLayout(month_year_layout)
        layout.addStretch()

        button_layout = QHBoxLayout()
        add_btn = QPushButton("Add Instance")
        add_btn.clicked.connect(self._add_instance)
        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)

        button_layout.addWidget(add_btn)
        button_layout.addWidget(cancel_btn)
        layout.addLayout(button_layout)

    def _add_instance(self):
        self.account = self.account_edit.text().strip()
        self.password = self.password_edit.text().strip()
        self.selected_city = self.city_edit.text().strip()
        self.selected_month = self.month_combo.currentText()
        self.selected_year = self.year_combo.currentText()

        if not self.account or not self.password or not self.selected_city:
            QMessageBox.warning(self, "Input Required", "Account, Password, and City cannot be empty.")
            return
        
        self.accept()


class EditInstanceDialog(QDialog):
    """
    A high-tech, modeless dashboard replicating the JS HUD.
    Features auto-save capabilities mapped directly to ChromeManager.
    """
    def __init__(self, parent, instance: ChromeManager):
        super().__init__(parent)
        self.instance = instance
        self.parent_window = parent

        self.setWindowFlags(Qt.WindowType.Window)
        self.setWindowTitle(f"Hot-Patch Dashboard: {instance.account}")
        self.setFixedSize(450, 800)
        self.setStyleSheet("background-color: #060c1a;") 

        self.SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        self.FULL_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        
        self.current_month_idx = 7
        self.current_year = "2026"
        
        # Ensure persistent properties exist on the instance so they survive dialog closes
        if not hasattr(self.instance, 'max_year'): self.instance.max_year = "2027"
        if not hasattr(self.instance, 'max_month'): self.instance.max_month = "12"
        if not hasattr(self.instance, 'js_swap'): self.instance.js_swap = True
        if not hasattr(self.instance, 'js_nav'): self.instance.js_nav = True
        if not hasattr(self.instance, 'js_hide_m'): self.instance.js_hide_m = True
        if not hasattr(self.instance, 'js_hide_s'): self.instance.js_hide_s = True

        self._parse_initial_date()
        self._init_ui()
        
        self.live_timer = QTimer(self)
        self.live_timer.timeout.connect(self._update_live_status)
        self.live_timer.start(500)

    def _parse_initial_date(self):
        try:
            parts = self.instance.target_month.strip().split()
            if len(parts) == 2:
                m_full, y = parts
                if m_full in self.FULL_MONTHS:
                    self.current_month_idx = self.FULL_MONTHS.index(m_full)
                self.current_year = y
        except Exception:
            pass

    def _init_ui(self):
        main_layout = QVBoxLayout(self)
        main_layout.setContentsMargins(15, 15, 15, 15)
        main_layout.setSpacing(10)

        GROUP_STYLE = """
            QGroupBox { color: #94A3B8; font-size: 10px; font-weight: bold; letter-spacing: 1.5px; border: 1px solid rgba(99,102,241,0.2); border-radius: 8px; margin-top: 12px; } 
            QGroupBox::title { subcontrol-origin: margin; left: 10px; padding: 0 5px; }
        """
        INPUT_STYLE = "background-color: rgba(6,12,26,0.9); color: #F1F5F9; border: 1px solid rgba(99,102,241,0.2); border-radius: 6px; padding: 6px; font-size: 12px;"
        LABEL_STYLE = "color: #475569; font-weight: bold; font-size: 10px;"

        # --- 0. ACCOUNT & CREDENTIALS SECTION ---
        acc_group = QGroupBox("TARGET CONTEXT")
        acc_group.setStyleSheet(GROUP_STYLE)
        acc_layout = QGridLayout(acc_group)
        
        acc_layout.addWidget(QLabel("Email:"), 0, 0)
        self.email_edit = QLineEdit(self.instance.account)
        self.email_edit.setStyleSheet(INPUT_STYLE)
        self.email_edit.textEdited.connect(self._auto_save_context)
        acc_layout.addWidget(self.email_edit, 0, 1)

        acc_layout.addWidget(QLabel("Pass:"), 0, 2)
        
        pass_layout = QHBoxLayout()
        pass_layout.setSpacing(0)
        pass_layout.setContentsMargins(0, 0, 0, 0)
        
        self.pass_edit = QLineEdit(self.instance.password)
        self.pass_edit.setStyleSheet("background-color: rgba(6,12,26,0.9); color: #F1F5F9; border: 1px solid rgba(99,102,241,0.2); border-top-left-radius: 6px; border-bottom-left-radius: 6px; padding: 6px; font-size: 12px; border-right: none;")
        self.pass_edit.setEchoMode(QLineEdit.EchoMode.Password)
        self.pass_edit.textEdited.connect(self._auto_save_context)
        
        self.pass_toggle_btn = QPushButton("👁")
        self.pass_toggle_btn.setCursor(Qt.CursorShape.PointingHandCursor)
        self.pass_toggle_btn.setStyleSheet("background-color: rgba(6,12,26,0.9); color: #94A3B8; border: 1px solid rgba(99,102,241,0.2); border-top-right-radius: 6px; border-bottom-right-radius: 6px; padding: 6px; border-left: none; font-size: 12px;")
        self.pass_toggle_btn.clicked.connect(self._toggle_password)
        
        pass_layout.addWidget(self.pass_edit)
        pass_layout.addWidget(self.pass_toggle_btn)
        acc_layout.addLayout(pass_layout, 0, 3)

        acc_layout.addWidget(QLabel("City:"), 1, 0)
        self.city_edit = QLineEdit(self.instance.target_city)
        self.city_edit.setStyleSheet(INPUT_STYLE)
        self.city_edit.textEdited.connect(self._auto_save_context)
        acc_layout.addWidget(self.city_edit, 1, 1, 1, 3)
        main_layout.addWidget(acc_group)

        # --- 1. TARGET MONTH SECTION ---
        month_group = QGroupBox("TARGET MONTH (FIRST VISIBLE)")
        month_group.setStyleSheet(GROUP_STYLE)
        m_layout = QVBoxLayout(month_group)
        
        grid = QGridLayout()
        grid.setSpacing(4)
        self.month_buttons = []
        for i, m_str in enumerate(self.SHORT_MONTHS):
            btn = QPushButton(m_str)
            btn.setCursor(Qt.CursorShape.PointingHandCursor)
            btn.clicked.connect(lambda checked, idx=i: self._select_month(idx))
            self.month_buttons.append(btn)
            grid.addWidget(btn, i // 4, i % 4)
        
        m_layout.addLayout(grid)

        y_layout = QHBoxLayout()
        y_label = QLabel("Y:")
        y_label.setStyleSheet(LABEL_STYLE)
        self.year_edit = QLineEdit(self.current_year)
        self.year_edit.setStyleSheet(INPUT_STYLE)
        self.year_edit.textEdited.connect(self._auto_save_date) 
        
        y_layout.addWidget(y_label)
        y_layout.addWidget(self.year_edit)
        m_layout.addLayout(y_layout)
        
        self._update_month_btns()
        main_layout.addWidget(month_group)

        # --- 1.5 TIMING / REFRESH SECONDS ---
        timing_group = QGroupBox("REFRESH TIMING")
        timing_group.setStyleSheet(GROUP_STYLE)
        t_layout = QHBoxLayout(timing_group)
        
        sec_lbl = QLabel("Sec:")
        sec_lbl.setStyleSheet(LABEL_STYLE)
        self.sec_edit = QLineEdit(str(self.instance.target_sec))
        self.sec_edit.setStyleSheet(INPUT_STYLE)
        self.sec_edit.textEdited.connect(self._auto_save_timing)

        ms_lbl = QLabel("Ms:")
        ms_lbl.setStyleSheet(LABEL_STYLE)
        self.ms_edit = QLineEdit(str(self.instance.target_ms))
        self.ms_edit.setStyleSheet(INPUT_STYLE)
        self.ms_edit.textEdited.connect(self._auto_save_timing)

        t_layout.addWidget(sec_lbl)
        t_layout.addWidget(self.sec_edit)
        t_layout.addWidget(ms_lbl)
        t_layout.addWidget(self.ms_edit)
        main_layout.addWidget(timing_group)

        # --- 2. BEHAVIOR SECTION ---
        behavior_group = QGroupBox("BEHAVIOR")
        behavior_group.setStyleSheet(GROUP_STYLE)
        b_layout = QVBoxLayout(behavior_group)
        b_layout.setSpacing(6)
        
        SWITCH_STYLE = """
            QCheckBox { color: #CBD5E1; font-size: 11px; spacing: 10px; } 
            QCheckBox::indicator { width: 36px; height: 20px; border-radius: 10px; background: rgba(255,255,255,0.08); } 
            QCheckBox::indicator:checked { background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #10b981, stop:1 #34d399); }
        """
        self.chk_swap = QCheckBox("Swap currentDate (server-side)")
        self.chk_nav = QCheckBox("Auto-navigate (fallback)")
        self.chk_hide_m = QCheckBox("Hide months before target")
        self.chk_hide_s = QCheckBox("Hide slots before target")
        
        # Load from instance
        self.chk_swap.setChecked(self.instance.js_swap)
        self.chk_nav.setChecked(self.instance.js_nav)
        self.chk_hide_m.setChecked(self.instance.js_hide_m)
        self.chk_hide_s.setChecked(self.instance.js_hide_s)

        for chk in [self.chk_swap, self.chk_nav, self.chk_hide_m, self.chk_hide_s]:
            chk.setStyleSheet(SWITCH_STYLE)
            chk.setCursor(Qt.CursorShape.PointingHandCursor)
            chk.setLayoutDirection(Qt.LayoutDirection.RightToLeft)
            chk.clicked.connect(self._auto_save_switches)
            b_layout.addWidget(chk)
        
        main_layout.addWidget(behavior_group)

        # --- 3. MAXDATE OVERRIDE SECTION ---
        maxd_group = QGroupBox("MAXDATE OVERRIDE")
        maxd_group.setStyleSheet(GROUP_STYLE)
        max_layout = QHBoxLayout(maxd_group)
        
        l_y = QLabel("Y:")
        l_y.setStyleSheet(LABEL_STYLE)
        self.max_y = QLineEdit(self.instance.max_year)
        self.max_y.setStyleSheet(INPUT_STYLE)
        
        l_m = QLabel("M:")
        l_m.setStyleSheet(LABEL_STYLE)
        self.max_m = QLineEdit(self.instance.max_month)
        self.max_m.setStyleSheet(INPUT_STYLE)
        
        btn_set = QPushButton("Set")
        btn_set.setCursor(Qt.CursorShape.PointingHandCursor)
        btn_set.setStyleSheet("background-color: #F59E0B; color: white; border: none; font-weight: bold; border-radius: 6px; padding: 6px 14px;")
        
        self.max_y.textEdited.connect(self._auto_save_maxdate)
        self.max_m.textEdited.connect(self._auto_save_maxdate)
        btn_set.clicked.connect(self._auto_save_maxdate)

        max_layout.addWidget(l_y)
        max_layout.addWidget(self.max_y)
        max_layout.addWidget(l_m)
        max_layout.addWidget(self.max_m)
        max_layout.addWidget(btn_set)
        main_layout.addWidget(maxd_group)

        # --- 4. STATUS & COUNTERS SECTION ---
        status_group = QGroupBox("STATUS & COUNTERS")
        status_group.setStyleSheet(GROUP_STYLE)
        s_layout = QGridLayout(status_group)
        
        for idx, text in enumerate(["Target:", "maxDate:", "Showing:", "curDate:"]):
            lbl = QLabel(text)
            lbl.setStyleSheet("color: #64748B; font-size: 11px;")
            s_layout.addWidget(lbl, idx % 2, (idx // 2) * 2)

        self.val_tgt = QLabel(self.instance.target_month)
        self.val_max = QLabel(f"{self.instance.max_year}-{self.instance.max_month.zfill(2)}")
        self.val_shw = QLabel("Offline")
        self.val_cur = QLabel("Offline")

        for lbl in [self.val_tgt, self.val_shw, self.val_max, self.val_cur]:
            lbl.setTextInteractionFlags(Qt.TextInteractionFlag.TextSelectableByMouse)
            
        PILL_STYLE = "font-family: 'JetBrains Mono', monospace; font-weight: bold; font-size: 11px; padding: 3px 8px; border-radius: 4px;"
        self.val_tgt.setStyleSheet(f"color: #34D399; background: rgba(16,185,129,0.15); {PILL_STYLE}")
        self.val_max.setStyleSheet(f"color: #FBBF24; background: rgba(251,191,36,0.15); {PILL_STYLE}")
        self.val_shw.setStyleSheet(f"color: #67E8F9; background: transparent; {PILL_STYLE}")
        self.val_cur.setStyleSheet(f"color: #F0ABFC; background: transparent; {PILL_STYLE}")

        s_layout.addWidget(self.val_tgt, 0, 1)
        s_layout.addWidget(self.val_max, 1, 1)
        s_layout.addWidget(self.val_shw, 0, 3)
        s_layout.addWidget(self.val_cur, 1, 3)
        main_layout.addWidget(status_group)

        # --- 5. BOTTOM ACTIONS ---
        btn_layout = QHBoxLayout()
        
        btn_launch = QPushButton("🚀 Launch")
        btn_launch.setCursor(Qt.CursorShape.PointingHandCursor)
        btn_launch.setStyleSheet("background: qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0 #0891b2, stop:1 #0e7490); color: white; font-weight: bold; font-size: 12px; padding: 9px 12px; border-radius: 6px; border: none;")
        btn_launch.clicked.connect(self._launch_instance)
        
        btn_reapply = QPushButton("↻ Reapply")
        btn_reapply.setCursor(Qt.CursorShape.PointingHandCursor)
        btn_reapply.setStyleSheet("background: rgba(255,255,255,0.06); color: #CBD5E1; padding: 9px 12px; border-radius: 6px; font-weight: bold; border: 1px solid rgba(255,255,255,0.1);")
        btn_reapply.clicked.connect(self._reapply_js)
        
        btn_reload = QPushButton("⟳ Reload")
        btn_reload.setCursor(Qt.CursorShape.PointingHandCursor)
        btn_reload.setStyleSheet("background: rgba(255,255,255,0.06); color: #CBD5E1; padding: 9px 12px; border-radius: 6px; font-weight: bold; border: 1px solid rgba(255,255,255,0.1);")
        btn_reload.clicked.connect(self._reload_page)

        btn_layout.addWidget(btn_launch)
        btn_layout.addWidget(btn_reapply)
        btn_layout.addWidget(btn_reload)
        main_layout.addLayout(btn_layout)

    def _toggle_password(self, *args):
        if self.pass_edit.echoMode() == QLineEdit.EchoMode.Password:
            self.pass_edit.setEchoMode(QLineEdit.EchoMode.Normal)
            self.pass_toggle_btn.setText("🙈")
        else:
            self.pass_edit.setEchoMode(QLineEdit.EchoMode.Password)
            self.pass_toggle_btn.setText("👁")

    def _select_month(self, idx):
        self.current_month_idx = idx
        self._update_month_btns()
        self._auto_save_date()

    def _update_month_btns(self):
        for i, btn in enumerate(self.month_buttons):
            if i == self.current_month_idx:
                btn.setStyleSheet("background: qlineargradient(x1:0, y1:0, x2:0, y2:1, stop:0 #10b981, stop:1 #059669); color: white; border: 1px solid #34d399; font-weight: bold; font-size: 11px; padding: 6px 4px; border-radius: 6px;")
            else:
                btn.setStyleSheet("background: rgba(6,12,26,0.8); color: #64748B; border: 1px solid rgba(99,102,241,0.2); font-weight: bold; font-size: 11px; padding: 6px 4px; border-radius: 6px;")

    def _auto_save_context(self, *args):
        self.instance.account = self.email_edit.text().strip()
        self.instance.password = self.pass_edit.text().strip()
        self.instance.target_city = self.city_edit.text().strip()

    def _auto_save_date(self, *args):
        y_str = self.year_edit.text().strip()
        if y_str.isdigit() and len(y_str) == 4:
            full_month = self.FULL_MONTHS[self.current_month_idx]
            new_target = f"{full_month} {y_str}"
            self.instance.target_month = new_target
            self.val_tgt.setText(new_target)

    def _auto_save_timing(self, *args):
        sec = self.sec_edit.text().strip()
        ms = self.ms_edit.text().strip()
        if sec.isdigit(): self.instance.target_sec = int(sec)
        if ms.isdigit(): self.instance.target_ms = int(ms)

    def _auto_save_switches(self, *args):
        self.instance.js_swap = self.chk_swap.isChecked()
        self.instance.js_nav = self.chk_nav.isChecked()
        self.instance.js_hide_m = self.chk_hide_m.isChecked()
        self.instance.js_hide_s = self.chk_hide_s.isChecked()

    def _auto_save_maxdate(self, *args):
        y = self.max_y.text().strip()
        m = self.max_m.text().strip()
        if y.isdigit() and m.isdigit():
            self.instance.max_year = y      
            self.instance.max_month = m     
            self.val_max.setText(f"{y}-{m.zfill(2)}")

    def _update_live_status(self, *args):
        self.val_tgt.setText(self.instance.target_month)
        if self.instance.is_running and self.instance.driver:
            self.val_shw.setText("Active")
            self.val_cur.setText("Swapped")
        else:
            self.val_shw.setText("Offline")
            self.val_cur.setText("Offline")

    def _launch_instance(self, *args):
        if not self.instance.is_running:
            self.instance.start_engine()
        else:
            parent = self.parent()
            if hasattr(parent, '_view_instance'):
                parent._view_instance(self.instance.account)

    def _reapply_js(self, *args):
        if self.instance.is_running and self.instance.driver:
            try:
                self.instance.driver.execute_script("try { hidePastMonths(); hidePastSlots(); } catch(e) {}")
            except Exception:
                pass

    def _reload_page(self, *args):
        if self.instance.is_running and self.instance.driver:
            try:
                self.instance.driver.refresh()
            except Exception:
                pass