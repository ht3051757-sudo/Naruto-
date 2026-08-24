// 1. NHÚNG ĐOẠN CẤU HÌNH FIREBASE CỦA BẠN VÀO ĐÂY
const firebaseConfig = {
    apiKey: "THAY_BẰNG_API_KEY_CỦA_BẠN",
    authDomain: "THAY_BẰNG_AUTH_DOMAIN_CỦA_BẠN",
    projectId: "THAY_BẰNG_PROJECT_ID_CỦA_BẠN",
    storageBucket: "THAY_BẰNG_STORAGE_BUCKET_CỦA_BẠN",
    messagingSenderId: "THAY_BẰNG_MESSAGING_SENDER_ID_CỦA_BẠN",
    appId: "THAY_BẰNG_APP_ID_CỦA_BẠN"
};

// 2. Khởi tạo kết nối với Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 3. HÀM XỬ LÝ ĐĂNG KÝ TÀI KHOẢN MỚI
function dangKyTaiKhoan(email, password, username) {
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            // Tạo dữ liệu ban đầu cho người chơi trong cơ sở dữ liệu
            db.collection("users").doc(user.uid).set({
                username: username,
                email: email,
                coins: 200,          // Tặng sẵn 200 Xu
                ownedChars: ["Naruto"], // Tặng sẵn tướng mặc định
                isBanned: false      // Trạng thái khóa tài khoản
            })
            .then(() => {
                alert("Đăng ký tài khoản thành công!");
                window.location.reload(); // Tải lại trang để đăng nhập
            });
        })
        .catch((error) => {
            alert("Lỗi đăng ký: " + error.message);
        });
}

// 4. HÀM XỬ LÝ ĐĂNG NHẬP
function dangNhapTaiKhoan(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Kiểm tra xem người chơi này có bị BAN (khóa) hay không
            db.collection("users").doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    
                    if (userData.isBanned === true) {
                        // Nếu bị ban, lập tức đăng xuất và chặn lại
                        auth.signOut();
                        alert("Tài khoản của bạn đã bị BAN khỏi hệ thống!");
                        window.location.href = "about:blank"; // Đẩy ra trang trống
                    } else {
                        alert("Đăng nhập thành công! Chào mừng " + userData.username);
                        // Chuyển sang màn hình chọn tướng và kích hoạt game
                        vaoSanhChoiGame(userData);
                    }
                }
            });
        })
        .catch((error) => {
            alert("Sai tài khoản hoặc mật khẩu!");
        });
}

// Hàm giả định để chuyển giao diện sau khi đăng nhập thành công
function vaoSanhChoiGame(userData) {
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("main-container").style.display = "flex";
    // Cập nhật Xu và Tên người chơi lên màn hình game
    document.getElementById("user-coins").innerText = userData.coins;
    currentUser = userData.username; 
              }
                  
