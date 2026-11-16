/* =====================================================================
   CẤU HÌNH SUPABASE — bạn dev điền 2 giá trị dưới đây.
   Lấy ở Supabase: Project Settings > API.
   ANON key là khóa công khai (an toàn vì đã bật RLS).
   ===================================================================== */
window.SUPA = {
  URL: "https://nqvexaqcdjyqekryrjtx.supabase.co",
  ANON_KEY: "sb_publishable_PanHiMdWhbQN53vuBWsG4Q_9Q7B6fpF"
};

/* Mã cấp dùng cho item_key (để mở rộng nhiều cấp sau này). */
window.LEVEL_ID = "c1";

/* Goong (bản đồ địa chỉ Việt Nam) — dùng cho tìm/gợi ý địa chỉ ở trang Bản đồ KH.
   Key nên được giới hạn theo tên miền cuong-lc.github.io trong dashboard Goong. */
window.GOONG_KEY = "21nP2IqruM3q48drULfj9IMxjk0BThE6aA7zEUEF";
window.GOONG_KEY2 = 'cqu3rnCw3cxTmp74WphQcbcHmr4Z5q3FGNnSXXnN'; // key dự phòng (xoay vòng khi key 1 hết lượt ngày)
window.VIETMAP_KEY = '14ccd31e3ec6d3cbadc7a85549d358beccbc718516718f49'; // VietMap Default Key — dự phòng khi cả 2 key Goong hết lượt
/* Maptiles key (hiển thị nền bản đồ Goong). Cũng nên giới hạn domain cuong-lc.github.io. */
window.GOONG_MAPTILES_KEY = "OvWa4WR5PaarBdssvzbdyh6jrSsx7ouua4qvy2sN";
