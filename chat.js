// --- CẤU HÌNH LIÊN KẾT KHUNG CHAT CỘNG ĐỒNG (WEBSOCKET MIỄN PHÍ) ---
let socket;

// Hàm này sẽ được gọi tự động sau khi người chơi Đăng nhập thành công ở file auth.js
function batDauKetNoiChat() {
    // Sử dụng máy chủ WebSocket công cộng chạy thử nghiệm miễn phí ổn định
    socket = new WebSocket("wss://://piesocket.com");

    // Lắng nghe khi có tin nhắn mới từ người khác gửi đến
    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        // Nếu đúng là dữ liệu chat, tiến hành in tin nhắn ra màn hình
        if (data.type === "chat") {
            hienThiTinNhan(data.sender, data.text);
        }
    };

    // Tự động thông báo khi kết nối mạng thành công
    socket.onopen = function() {
        console.log("Đã kết nối vào phòng chat thế giới!");
        // Thông báo cho mọi người biết mình vừa vào game (Biến currentUser lấy từ file auth.js)
        guiTinNhanHeThong(`Người chơi [${currentUser}] đã online.`);
    };

    // Xử lý nếu mạng bị lỗi ngắt kết nối
    socket.onclose = function() {
        console.log("Mất kết nối chat, đang thử lại...");
        setTimeout(batDauKetNoiChat, 3000); // Thử kết nối lại sau 3 giây
    };
}

// Hàm gửi tin nhắn của chính bạn lên Server
function guiTinNhanCuaToi() {
    const khungNhap = document.getElementById("chat-input");
    if (!khungNhap) return;

    const noiDung = khungNhap.value.trim();
    if (!noiDung) return; // Nếu ô chat trống thì không gửi

    // BỘ LỌC CHẶN NGƯỜI CHƠI PHÁ HOẠI (TÍNH NĂNG CẤM CHAT / BAN CHAT)
    // Bạn có thể thêm tên tài khoản muốn cấm chat vào danh sách này
    const danhSachCamChat = ["hacker_chui_the", "acc_clone_pha_chat"];
    if (danhSachCamChat.includes(currentUser)) {
        alert("Tài khoản của bạn đã bị Admin cấm chat cộng đồng!");
        khungNhap.value = "";
        return;
    }

    // Gửi dữ liệu dạng chữ lên hệ thống mạng WebSocket
    const packet = {
        type: "chat",
        sender: currentUser, // Tên của bạn
        text: noiDung         // Nội dung bạn gõ
    };

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(packet));
    }

    khungNhap.value = ""; // Xóa chữ trong ô nhập sau khi gửi xong
}

// Hàm gửi các thông báo tự động từ hệ thống game
function guiTinNhanHeThong(chuoiThongBao) {
    const packet = {
        type: "chat",
        sender: "Hệ thống",
        text: chuoiThongBao
    };
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(packet));
    }
}

// Hàm nhận dữ liệu và in dòng chữ chat ra giao diện màn hình web
function hienThiTinNhan(tenNguoiGui, noiDungChu) {
    const vungChuaChat = document.getElementById("chat-messages");
    if (!vungChuaChat) return;

    // Tạo một khối văn bản mới cho tin nhắn
    const khoiTinNhan = document.createElement("div");
    
    // Nếu là thông báo hệ thống thì đổi kiểu trang trí khác
    if (tenNguoiGui === "Hệ thống") {
        khoiTinNhan.className = "msg system";
        khoiTinNhan.style.fontStyle = "italic";
        khoiTinNhan.style.color = "#aaa";
    } else {
        khoiTinNhan.className = "msg";
        khoiTinNhan.style.background = "#262626";
        khoiTinNhan.style.padding = "6px 10px";
        khoiTinNhan.style.borderRadius = "6px";
        khoiTinNhan.style.marginBottom = "5px";
    }
    
    // Ghép chữ vào khối và đẩy vào khung chat
    khoiTinNhan.innerHTML = `<span style="font-weight:bold; color:#00ffcc;">${tenNguoiGui}:</span> <span>${noiDungChu}</span>`;
    vungChuaChat.appendChild(khoiTinNhan);

    // Tự động cuộn khung chat xuống dưới cùng khi có tin nhắn mới tràn màn hình
    vungChuaChat.scrollTop = vungChuaChat.scrollHeight;
}
function vaoSanhChoiGame(userData) {
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("main-container").style.display = "flex";
    document.getElementById("user-coins").innerText = userData.coins;
    currentUser = userData.username; 

    // CHÈN THÊM DÒNG NÀY VÀO ĐỂ BẬT CHAT KHI VÀO GAME
    batDauKetNoiChat(); 
}
