// --- HỆ THỐNG LỆNH ADMIN: BAN & MUTE ---

// 1. Hàm thực hiện lệnh BAN (Khóa tài khoản vĩnh viễn)
function banNguoiChoi(userId) {
    if (!confirm("Bạn có chắc chắn muốn BAN (khóa) tài khoản này không?")) return;

    // Cập nhật trạng thái isBanned thành true trên Firebase Database
    db.collection("users").doc(userId).update({
        isBanned: true
    })
    .then(() => {
        alert("Đã BAN tài khoản thành công! Người chơi này sẽ bị chặn ở lần đăng nhập tới.");
        
        // Gửi lệnh ngắt kết nối hoặc thông báo ẩn qua hệ thống Chat thế giới để ép họ văng game
        guiTinNhanHeThong(`Tài khoản ID [${userId}] đã bị Admin khóa vĩnh viễn khỏi trò chơi.`);
    })
    .catch((error) => {
        alert("Lỗi khi thực hiện lệnh BAN: " + error.message);
    });
}

// 2. Hàm thực hiện lệnh MUTE (Cấm chat cộng đồng)
function muteNguoiChoi(userId) {
    if (!confirm("Bạn có chắc chắn muốn MUTE (cấm chat) tài khoản này không?")) return;

    // Cập nhật trạng thái isMuted thành true trên Firebase Database
    db.collection("users").doc(userId).update({
        isMuted: true
    })
    .then(() => {
        alert("Đã MUTE tài khoản thành công! Người chơi này không thể gửi tin nhắn chat nữa.");
        guiTinNhanHeThong(`Người chơi ID [${userId}] đã bị Admin cấm ngôn (MUTE).`);
    })
    .catch((error) => {
        alert("Lỗi khi thực hiện lệnh MUTE: " + error.message);
    });
}

// 3. Hàm thực hiện lệnh UNMUTE (Mở khóa chat khi họ cải tà quy chính)
function unmuteNguoiChoi(userId) {
    db.collection("users").doc(userId).update({
        isMuted: false
    })
    .then(() => {
        alert("Đã mở khóa chat (UNMUTE) thành công!");
    });
      }
          
