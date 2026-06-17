/* ============================================================
   KHUNG NĂNG LỰC ĐỘI NGŨ KINH DOANH SAPO — DỮ LIỆU
   Anh có thể chỉnh trực tiếp nội dung trong file này.
   Cấu trúc: LEVELS (4 cấp) + GROUPS (5 domain) + COMPETENCIES (13 năng lực).
   Mỗi năng lực có: levels (chuẩn cần đạt từng cấp) + playbook (cần bổ sung gì để lên cấp).
   ============================================================ */

const LEVELS = [
  {
    id: "c1", order: 1, title: "Nhân viên Kinh doanh", short: "Nhân viên",
    file: "cap-1-nhan-vien.html", dreyfus: "Bậc 1–2 · Novice → Advanced Beginner",
    color: "#4DA3FF", valueStages: ["thuoc", "hieu"],
    role: "Người trực tiếp bán hàng, đang học việc và xây nền tảng. Làm đúng quy trình, đạt KPI hoạt động cơ bản, cần được hướng dẫn và giám sát.",
    kpis: [
      "Số cuộc gọi / cuộc gặp / demo theo định mức",
      "Số đơn chốt được (đặc biệt đơn đầu tiên)",
      "Tỷ lệ nhập liệu CRM đầy đủ, đúng hạn"
    ],
    okr: {
      o: "Trở thành nhân viên bán hàng vững nền tảng, tự chủ được công việc cơ bản.",
      kr: [
        "Đạt 100% KPI hoạt động (gọi / gặp / demo) 3 tháng liên tiếp",
        "Chốt tối thiểu ___ đơn đúng quy trình",
        "Đạt 100% chuẩn nhập liệu CRM"
      ]
    },
    nextChecklist: [
      "3 tháng liên tiếp đạt KPI hoạt động",
      "Tự chốt được đơn đúng quy trình",
      "Pass bài kiểm tra kiến thức sản phẩm",
      "Dữ liệu CRM đạt chuẩn (đầy đủ, đúng hạn)"
    ]
  },
  {
    id: "c2", order: 2, title: "Chuyên gia Kinh doanh", short: "Chuyên gia",
    file: "cap-2-chuyen-gia.html", dreyfus: "Bậc 3 · Competent",
    color: "#007AFF", valueStages: ["apdung"],
    gate: [
      "Doanh thu đóng góp > 1 tỷ / năm",
      "Kèm cặp tối thiểu 3 bạn lên Nhân viên Kinh doanh",
      "Hỗ trợ nhóm 3 bạn trong team"
    ],
    reviewCycle: "Xét 2 lần/năm — vào quý II và cuối năm.",
    role: "Người bán hàng tự chủ, đạt/vượt target ổn định, làm chủ chuyên môn và là chỗ dựa chuyên môn cho đồng đội.",
    kpis: [
      "Doanh số cá nhân (đạt/vượt target)",
      "Tỷ lệ chốt đơn",
      "Tỷ lệ tái ký / upsell"
    ],
    okr: {
      o: "Trở thành chuyên gia bán hàng tự chủ, vượt target ổn định.",
      kr: [
        "Vượt target doanh số ≥ ___% trong 2 quý",
        "Tỷ lệ chốt đạt ≥ ___%",
        "Tạo ≥ ___ khách tái ký / upsell"
      ]
    },
    nextChecklist: [
      "Vượt target doanh số ≥ 2 quý liên tiếp",
      "Có khách tái ký hoặc upsell thành công",
      "Hỗ trợ kèm tối thiểu 1 nhân sự mới",
      "Được đánh giá thành thạo toàn bộ quy trình bán"
    ]
  },
  {
    id: "c3", order: 3, title: "Trưởng phòng Kinh doanh", short: "Trưởng phòng",
    file: "cap-3-truong-phong.html", dreyfus: "Bậc 4 · Proficient",
    color: "#0057C7", reviewBased: true, valueStages: ["lantoa"],
    gate: [
      "Cá nhân tối thiểu đạt cấp 3 sao",
      "Quản lý team 6–10 thành viên (chuẩn 8)",
      "Doanh thu mềm > 250M / tháng (tiêu chuẩn 500M)"
    ],
    managerSkills: [
      { g: "Vẫn là người bán giỏi (giữ số cá nhân)", items: [
        "Trực tiếp bán & chốt deal khó — nhảy vào deal/demo khi nhân viên cần",
        "Làm gương quy trình & dữ liệu — bản thân chuẩn mực để cả phòng noi theo"
      ]},
      { g: "Coaching & phát triển con người", items: [
        "Coaching 1-1 theo khung năng lực",
        "Phản hồi & đánh giá hiệu suất (feedback đúng cách)",
        "Tuyển chọn, onboarding & “ramp” nhân sự mới đạt năng suất"
      ]},
      { g: "Quản trị số & pipeline", items: [
        "Soi pipeline & coaching theo từng deal",
        "Dự báo doanh số (forecast) chính xác",
        "Phân tích dữ liệu & quản trị hiệu suất — đặt kỳ vọng, accountability, xử lý người chưa đạt"
      ]},
      { g: "Lãnh đạo & vận hành phòng", items: [
        "Lập kế hoạch & phân bổ chỉ tiêu/tệp khách cho phòng",
        "Dẫn dắt họp phòng & duy trì nhịp làm việc (cadence)",
        "Giao tiếp, giải quyết xung đột & gắn kết văn hóa phòng",
        "Quản lý thời gian, ưu tiên giữa “đánh” và “dẫn” (tránh bẫy player-coach)"
      ]}
    ],
    role: "Người dẫn dắt một phòng/nhóm kinh doanh, chịu trách nhiệm target nhóm, coaching và vận hành đội ngũ.",
    kpis: [
      "Doanh số nhóm (đạt/vượt target)",
      "Tỷ lệ nhân sự trong nhóm đạt target",
      "Tỷ lệ giữ chân nhân sự"
    ],
    okr: {
      o: "Dẫn dắt nhóm đạt và vượt mục tiêu một cách bền vững.",
      kr: [
        "Nhóm đạt ≥ 100% target 2 quý liên tiếp",
        "≥ ___% nhân sự trong nhóm đạt target",
        "Phát triển ≥ 1 nhân sự lên cấp cao hơn"
      ]
    },
    nextChecklist: [
      "Nhóm đạt target ≥ 2 quý liên tiếp",
      "Phát triển ≥ 1 nhân sự lên cấp cao hơn",
      "Chuẩn hoá ≥ 1 quy trình / kịch bản cho nhóm",
      "Quản trị & dự báo pipeline nhóm chính xác"
    ],
    appointment: [
      "Kết quả kinh doanh nhóm ổn định, bền vững qua nhiều kỳ",
      "Tổ chức có nhu cầu hoặc vị trí trống ở cấp này",
      "Được tín nhiệm bởi đội nhóm và cấp trên",
      "Phù hợp giá trị và văn hoá Sapo",
      "Quyết định bổ nhiệm của Ban lãnh đạo"
    ]
  },
  {
    id: "c4", order: 4, title: "Giám đốc Trung tâm", short: "Giám đốc TT",
    file: "cap-4-giam-doc-trung-tam.html", dreyfus: "Bậc 5 · Expert",
    color: "#0F1437", reviewBased: true, valueStages: ["kientao"],
    gate: [
      "Quản trị 30–50 sale",
      "Doanh thu tối thiểu 2 tỷ"
    ],
    role: "Người hoạch định chiến lược và chịu trách nhiệm kết quả kinh doanh toàn trung tâm, phát triển đội ngũ lãnh đạo kế cận.",
    kpis: [
      "Doanh số & tăng trưởng toàn trung tâm",
      "Số lãnh đạo (Trưởng phòng) phát triển được",
      "Hiệu quả P&L của trung tâm"
    ],
    okr: {
      o: "Đưa trung tâm tăng trưởng bền vững và xây đội ngũ lãnh đạo kế cận.",
      kr: [
        "Đạt mục tiêu doanh số & P&L trung tâm cả năm",
        "Tăng trưởng ≥ ___% so với năm trước",
        "Phát triển ≥ 1 Trưởng phòng mới"
      ]
    },
    nextChecklist: [
      "Đạt mục tiêu kinh doanh & P&L trung tâm cả năm",
      "Phát triển ≥ 1 Trưởng phòng mới",
      "Triển khai sáng kiến cải tiến cấp hệ thống"
    ],
    appointment: [
      "Kết quả P&L trung tâm đạt mục tiêu qua nhiều kỳ",
      "Tổ chức có nhu cầu hoặc vị trí Giám đốc Trung tâm",
      "Năng lực lãnh đạo được chứng minh qua thời gian",
      "Tầm nhìn chiến lược và độ tin cậy với Ban lãnh đạo",
      "Quyết định bổ nhiệm của Ban lãnh đạo / Hội đồng"
    ]
  }
];

/* 5 domain */
const GROUPS = [
  { id: "d1", name: "Kiến thức chuyên môn", en: "Domain Knowledge", icon: "📘", color: "#007AFF" },
  { id: "d2", name: "Kỹ năng bán hàng", en: "Selling Skills", icon: "🎯", color: "#16D865" },
  { id: "d3", name: "Quản lý khách hàng & dữ liệu", en: "Customer & Data Management", icon: "🗂️", color: "#0196FF" },
  { id: "d4", name: "Thái độ & tố chất cá nhân", en: "Mindset & Personal Effectiveness", icon: "🧭", color: "#FFAE06" },
  { id: "d5", name: "Lãnh đạo & phát triển đội ngũ", en: "Leadership & People Development", icon: "🤝", color: "#004FA4" }
];

/* Mỗi năng lực:
   levels   = chuẩn cần đạt ở từng cấp (c1..c4)
   playbook = cần bổ sung gì ĐỂ LÊN chặng kế tiếp, tính từ cấp đó (c1=>c2...); c4 = duy trì & mở rộng */
const COMPETENCIES = [
  // ===== D1 · KIẾN THỨC CHUYÊN MÔN =====
  {
    id: "san-pham", group: "d1", name: "Sản phẩm & hệ sinh thái Sapo",
    levels: {
      c1: "Nắm các sản phẩm cốt lõi (Sapo POS, Web, F&B, GO) và bảng giá; trình bày đúng các tính năng chính.",
      c2: "Tư vấn trọn hệ sinh thái, ghép giải pháp theo nhu cầu, so sánh được với đối thủ.",
      c3: "Đào tạo kiến thức sản phẩm cho nhóm; cập nhật và phổ biến sản phẩm mới kịp thời.",
      c4: "Định hướng combo/giải pháp theo ngành; phản hồi nhu cầu thị trường về cho đội sản phẩm."
    },
    playbook: {
      c1: "Hoàn thành khoá sản phẩm nội bộ; tự demo 1 sản phẩm cho quản lý nghe và nhận góp ý.",
      c2: "Làm chủ thêm sản phẩm bổ trợ; xây bảng so sánh với đối thủ; chia sẻ 1 buổi cho đồng đội.",
      c3: "Soạn bộ tài liệu đào tạo sản phẩm cho nhóm; lập nhịp cập nhật sản phẩm mới định kỳ.",
      c4: "Đề xuất combo/giải pháp theo ngành; lập kênh phản hồi thị trường cho đội sản phẩm."
    }
  },
  {
    id: "nganh-khach", group: "d1", name: "Ngành hàng & khách hàng",
    levels: {
      c1: "Hiểu chân dung khách cơ bản và các nỗi đau phổ biến theo từng nhóm.",
      c2: "Phân tích nhu cầu sâu, nhận diện cơ hội theo từng ngành (bán lẻ, F&B, online).",
      c3: "Nắm bức tranh thị trường khu vực, phân bổ tệp khách hợp lý cho nhóm.",
      c4: "Hoạch định ưu tiên ngành/khu vực dựa trên tiềm năng và dữ liệu thị trường."
    },
    playbook: {
      c1: "Lập hồ sơ chân dung 3 nhóm khách tiêu biểu; đi cùng người giỏi ≥ 5 cuộc gặp để quan sát.",
      c2: "Phân tích nhu cầu sâu cho 1 ngành; tổng hợp insight thành tài liệu dùng chung.",
      c3: "Vẽ bản đồ thị trường khu vực; phân bổ tệp khách hợp lý cho nhóm.",
      c4: "Xây bảng ưu tiên ngành/khu vực dựa trên dữ liệu tiềm năng thị trường."
    }
  },
  // ===== D2 · KỸ NĂNG BÁN HÀNG =====
  {
    id: "prospecting", group: "d2", name: "Tìm kiếm & khai thác khách",
    levels: {
      c1: "Đạt KPI hoạt động (gọi, gặp, demo) theo định mức được giao.",
      c2: "Tự xây nguồn khách đa kênh, đảm bảo pipeline luôn đủ dày.",
      c3: "Thiết kế chiến dịch khai thác cho nhóm, phân bổ nguồn lực hợp lý.",
      c4: "Mở kênh/tệp khách mới quy mô lớn cho trung tâm."
    },
    playbook: {
      c1: "Đạt đủ KPI hoạt động; thử nghiệm 2 kênh tìm khách khác nhau và so sánh hiệu quả.",
      c2: "Xây nguồn khách đa kênh ổn định; duy trì pipeline đủ dày theo định mức.",
      c3: "Thiết kế 1 chiến dịch khai thác cho nhóm; phân bổ nguồn lực và đo kết quả.",
      c4: "Mở 1 kênh/tệp khách mới quy mô lớn cho trung tâm."
    }
  },
  {
    id: "tu-van-demo", group: "d2", name: "Tư vấn & demo giải pháp",
    levels: {
      c1: "Demo đúng kịch bản, trình bày tính năng rõ ràng.",
      c2: "Tư vấn theo nhu cầu, demo tuỳ biến, dẫn dắt câu chuyện giá trị.",
      c3: "Kèm cặp nhóm nâng chất lượng tư vấn; trực tiếp xử lý ca khó.",
      c4: "Định hình thông điệp tư vấn và bộ demo chuẩn theo ngành."
    },
    playbook: {
      c1: "Demo thuộc kịch bản; quay lại 1 buổi demo để tự rút kinh nghiệm với quản lý.",
      c2: "Tuỳ biến demo theo nhu cầu; luyện dẫn dắt câu chuyện giá trị thay vì liệt kê tính năng.",
      c3: "Kèm đồng đội nâng chất lượng tư vấn; trực tiếp xử lý ≥ 1 ca khó.",
      c4: "Định hình thông điệp và bộ demo chuẩn theo từng ngành."
    }
  },
  {
    id: "dam-phan-chot", group: "d2", name: "Đàm phán & chốt đơn",
    levels: {
      c1: "Chốt được đơn cơ bản, xử lý từ chối thường gặp (có hỗ trợ).",
      c2: "Đàm phán và chốt độc lập, giữ biên lợi nhuận, tỷ lệ chốt ổn định.",
      c3: "Hỗ trợ chốt deal lớn/khó của nhóm; chuẩn hoá kỹ thuật chốt.",
      c4: "Đàm phán hợp đồng chiến lược với đối tác/khách hàng lớn."
    },
    playbook: {
      c1: "Học mẫu xử lý 5 từ chối thường gặp; chốt đơn đầu tiên có người kèm.",
      c2: "Chốt độc lập giữ biên lợi nhuận; ghi lại kỹ thuật chốt hiệu quả của mình.",
      c3: "Hỗ trợ chốt deal lớn/khó của nhóm; chuẩn hoá kỹ thuật chốt thành tài liệu.",
      c4: "Trực tiếp đàm phán hợp đồng chiến lược với khách/đối tác lớn."
    }
  },
  // ===== D3 · QUẢN LÝ KHÁCH HÀNG & DỮ LIỆU =====
  {
    id: "quy-trinh", group: "d3", name: "Quy trình bán hàng",
    levels: {
      c1: "Thực hiện đúng từng bước quy trình chuẩn dưới sự hướng dẫn.",
      c2: "Vận hành quy trình thuần thục, tự điều chỉnh linh hoạt theo tình huống.",
      c3: "Giám sát và tối ưu việc tuân thủ quy trình của nhóm.",
      c4: "Thiết kế, chuẩn hoá và nhân bản quy trình bán cho toàn trung tâm."
    },
    playbook: {
      c1: "Thuộc và thực hành đủ các bước quy trình; được quản lý xác nhận tuân thủ.",
      c2: "Tự xử lý các tình huống lệch quy trình; ghi lại cách xử lý hay.",
      c3: "Giám sát tuân thủ quy trình của nhóm; tối ưu 1 bước đang nghẽn.",
      c4: "Chuẩn hoá và nhân bản quy trình bán cho toàn trung tâm."
    }
  },
  {
    id: "cham-soc-upsell", group: "d3", name: "Chăm sóc, giữ chân & upsell",
    levels: {
      c1: "Chăm sóc sau bán theo quy trình, thu thập phản hồi khách.",
      c2: "Giữ chân khách, tạo tái ký và upsell hiệu quả.",
      c3: "Xây kế hoạch chăm sóc và gia tăng giá trị vòng đời khách cho nhóm.",
      c4: "Định hướng chiến lược giữ chân và mở rộng doanh thu khách hiện hữu."
    },
    playbook: {
      c1: "Thực hiện đúng quy trình chăm sóc sau bán; thu phản hồi từ ≥ 10 khách.",
      c2: "Tạo 1 case tái ký/upsell; xây kịch bản chăm sóc cá nhân.",
      c3: "Lập kế hoạch chăm sóc và tăng giá trị vòng đời khách cho nhóm.",
      c4: "Định hướng chiến lược giữ chân và mở rộng doanh thu khách hiện hữu."
    }
  },
  {
    id: "du-lieu-crm", group: "d3", name: "Dữ liệu & CRM",
    levels: {
      c1: "Nhập liệu đầy đủ, chính xác, đúng hạn trên CRM.",
      c2: "Tự phân tích pipeline cá nhân để ra quyết định ưu tiên.",
      c3: "Đọc và phân tích số liệu nhóm, phát hiện điểm nghẽn.",
      c4: "Dùng dữ liệu để dự báo doanh số và hoạch định chiến lược."
    },
    playbook: {
      c1: "Nhập liệu đúng chuẩn 100% trong 1 tháng; thuộc các trường dữ liệu quan trọng.",
      c2: "Tự phân tích pipeline cá nhân hằng tuần để ưu tiên công việc.",
      c3: "Đọc dashboard nhóm; báo cáo điểm nghẽn và đề xuất hành động.",
      c4: "Dùng dữ liệu để dự báo doanh số và ra quyết định phân bổ nguồn lực."
    }
  },
  {
    id: "pipeline", group: "d3", name: "Quản lý pipeline & kế hoạch",
    levels: {
      c1: "Theo dõi pipeline cá nhân, báo cáo đúng hạn.",
      c2: "Tự quản trị pipeline, dự báo doanh số cá nhân tương đối chính xác.",
      c3: "Quản trị pipeline nhóm, phân bổ và dự báo doanh số nhóm.",
      c4: "Quản trị và dự báo doanh số toàn trung tâm, chịu trách nhiệm P&L."
    },
    playbook: {
      c1: "Theo dõi và báo cáo pipeline cá nhân đúng hạn hằng tuần.",
      c2: "Tập dự báo doanh số cá nhân; bám sát và cải thiện độ chính xác.",
      c3: "Quản trị pipeline nhóm; phân bổ và dự báo doanh số nhóm.",
      c4: "Quản trị và dự báo doanh số toàn trung tâm; chịu trách nhiệm P&L."
    }
  },
  // ===== D4 · THÁI ĐỘ & TỐ CHẤT CÁ NHÂN =====
  {
    id: "ky-luat", group: "d4", name: "Kỷ luật & chủ động",
    levels: {
      c1: "Đúng giờ, tuân thủ nội quy, hoàn thành việc được giao.",
      c2: "Chủ động đặt mục tiêu cao hơn, tự giải quyết vấn đề.",
      c3: "Làm gương về kỷ luật, tạo môi trường làm việc chuẩn mực.",
      c4: "Xây dựng văn hoá kỷ luật và hiệu suất cho toàn trung tâm."
    },
    playbook: {
      c1: "Duy trì đúng giờ và hoàn thành việc được giao; chủ động hỏi khi vướng.",
      c2: "Tự đặt mục tiêu cao hơn KPI; chủ động giải quyết vấn đề trước khi báo cáo.",
      c3: "Làm gương kỷ luật; thiết lập chuẩn mực làm việc cho nhóm.",
      c4: "Xây văn hoá kỷ luật và hiệu suất cho trung tâm."
    }
  },
  {
    id: "chu-so-huu", group: "d4", name: "Tư duy chủ sở hữu & chiến lược",
    levels: {
      c1: "Chịu trách nhiệm với kết quả công việc của mình.",
      c2: "Nghĩ về hiệu quả tổng thể, đề xuất cải tiến nhỏ.",
      c3: "Tư duy như chủ nhóm, cân đối nguồn lực và mục tiêu.",
      c4: "Tư duy chiến lược cấp trung tâm, ra quyết định dài hạn và chịu trách nhiệm P&L."
    },
    playbook: {
      c1: "Nhận trách nhiệm kết quả việc của mình; không đổ lỗi khi gặp khó.",
      c2: "Đề xuất ≥ 1 cải tiến nhỏ giúp hiệu quả chung của nhóm.",
      c3: "Cân đối nguồn lực và mục tiêu như chủ nhóm; ra quyết định dựa trên dữ liệu.",
      c4: "Tư duy chiến lược cấp trung tâm; ra quyết định dài hạn và chịu trách nhiệm P&L."
    }
  },
  // ===== D5 · LÃNH ĐẠO & PHÁT TRIỂN ĐỘI NGŨ =====
  {
    id: "dong-doi", group: "d5", name: "Tinh thần đồng đội",
    levels: {
      c1: "Hợp tác, chia sẻ thông tin, hỗ trợ khi được nhờ.",
      c2: "Chủ động hỗ trợ đồng đội, chia sẻ kinh nghiệm.",
      c3: "Xây dựng gắn kết nhóm, giải quyết xung đột nội bộ.",
      c4: "Kết nối liên phòng/nhóm, xây dựng đội ngũ đoàn kết quy mô lớn."
    },
    playbook: {
      c1: "Hỗ trợ đồng đội khi được nhờ; chia sẻ thông tin kịp thời.",
      c2: "Chủ động hỗ trợ và chia sẻ kinh nghiệm cho đồng đội.",
      c3: "Xây gắn kết nhóm; giải quyết ≥ 1 xung đột nội bộ.",
      c4: "Kết nối liên phòng/nhóm; xây đội ngũ đoàn kết quy mô lớn."
    }
  },
  {
    id: "coaching", group: "d5", name: "Coaching & phát triển người khác",
    levels: {
      c1: "Tiếp thu phản hồi, học hỏi liên tục.",
      c2: "Hỗ trợ kèm nhân sự mới, chia sẻ best practice.",
      c3: "Coaching 1-1 định kỳ, phát triển nhân sự lên cấp.",
      c4: "Phát triển đội ngũ lãnh đạo kế cận, xây lộ trình đào tạo."
    },
    playbook: {
      c1: "Chủ động xin và tiếp thu phản hồi; duy trì thói quen học hỏi.",
      c2: "Kèm 1 nhân sự mới; chia sẻ best practice cho đội.",
      c3: "Coaching 1-1 định kỳ; giúp ≥ 1 nhân sự lên cấp.",
      c4: "Phát triển đội ngũ lãnh đạo kế cận; xây lộ trình đào tạo."
    }
  }
];

/* ============================================================
   CHECKLIST THÀNH THẠO (ONBOARDING) — theo cấp.
   Nguồn: Google Sheet checklist Nhân viên FNB.
   Cấu trúc: parts -> categories -> items. opt = không bắt buộc.
   ============================================================ */
const CHECKLISTS = {
  c1: [
    {
      part: "Sản phẩm", categories: [
        { cat: "Mặt hàng", items: [
          { n: "Mặt hàng", d: "Thao tác thêm - sửa - xóa. Ghép thực đơn, danh mục, nhóm lựa chọn, ghép nguyên vật liệu. Tính tiền theo số lượng - trọng lượng - thời gian." },
          { n: "Thực đơn" }, { n: "Danh mục" }, { n: "Nhóm lựa chọn" }, { n: "Combo" }
        ]},
        { cat: "Kho hàng", items: [
          { n: "Nhập - xuất kho", d: "Kiểm tra xuất kho, nhập kho, giá vốn/nguyên liệu, mặt hàng." },
          { n: "Danh sách - lịch sử - kiểm kê", d: "Thêm - chỉnh sửa - xóa kho. Kiểm kê kho. Xem lịch sử kho. Quy đổi đơn vị." }
        ]},
        { cat: "Thiết lập khác", items: [
          { n: "QR Order", d: "Thiết lập, vận hành thực tế, tư vấn lợi ích & cách dùng hiệu quả." },
          { n: "Quản lý ca" },
          { n: "Thiết lập bàn", d: "Lên sơ đồ cho khách hàng." },
          { n: "Thiết lập bếp", d: "Ý nghĩa, thiết lập, vận hành với mô hình nhiều bar/bếp." },
          { n: "Thiết lập in", d: "Mẫu in hóa đơn, tem, bếp." },
          { n: "Phương thức thanh toán", d: "Thiết lập các phương thức và xử lý tình huống khi dùng." },
          { n: "Thiết lập giao hàng", d: "Ý nghĩa, thiết lập, vận hành với đối tác giao hàng (nhận đơn, book đơn, phí...)." }
        ]},
        { cat: "Khách hàng", items: [
          { n: "Danh sách khách hàng", d: "Tạo - sửa - xóa. Hiểu nhóm KH và thẻ thành viên, tư vấn ứng dụng thực tế." },
          { n: "Nhóm khách hàng" }, { n: "Thẻ thành viên" }
        ]},
        { cat: "Khuyến mãi", items: [
          { n: "Khuyến mãi theo phần trăm", d: "Thêm - tạo - tùy chỉnh các loại KM, cách áp dụng với đối tượng, tư vấn KH áp dụng vận hành." },
          { n: "Khuyến mãi theo số tiền" }, { n: "Khuyến mãi theo giá món" }, { n: "Khuyến mãi tặng món" }
        ]},
        { cat: "Hóa đơn", items: [
          { n: "Hóa đơn bán hàng", d: "Lọc - xóa - thông tin trong hóa đơn." },
          { n: "Hóa đơn điện tử", d: "Kết nối - Tạo - Gộp - Hủy." }
        ]},
        { cat: "Bán online", items: [
          { n: "Grabfood", d: "Liên kết và các thông tin cần lưu ý trên Grab." },
          { n: "Weborder", d: "Thiết lập, vận hành thực tế, tư vấn lợi ích & cách dùng hiệu quả." }
        ]},
        { cat: "Thu chi", items: [ { n: "Thu - Chi", d: "Tạo loại phiếu, danh sách thu chi." } ]},
        { cat: "Nhân viên", items: [
          { n: "Danh sách nhân viên", d: "Quản lý vai trò, danh sách và thiết bị trong cửa hàng: thêm, sửa, xóa." },
          { n: "Vai trò nhân viên" }, { n: "Quản lý thiết bị" }
        ]},
        { cat: "Chấm công & đặt bàn", items: [
          { n: "Thiết lập chấm công", d: "Vận hành thao tác chấm công, tư vấn áp dụng vào hệ thống của khách." },
          { n: "Chấm công" }, { n: "Quản lý chấm công" },
          { n: "Đặt bàn", d: "Các thao tác đặt bàn - quản lý đặt bàn." }
        ]},
        { cat: "Báo cáo", items: [
          { n: "Báo cáo doanh thu", d: "Hiểu - đọc được báo cáo, hướng dẫn khách vận dụng vào quy trình." },
          { n: "Báo cáo mặt hàng" }, { n: "Báo cáo kho hàng" }, { n: "Báo cáo tài chính" },
          { n: "Báo cáo khuyến mãi" }, { n: "Báo cáo nhân viên" }
        ]}
      ]
    },
    {
      part: "Triển khai", categories: [
        { cat: "Phần cứng", items: [
          { n: "Máy S4 Pro - Pro max", d: "Toàn bộ thao tác trên máy bán hàng với app riêng. Các cổng chức năng, kết nối thiết bị khác." },
          { n: "Máy M2 Pro", d: "Sử dụng, thiết lập app phục vụ, kết nối máy in, các lỗi thường gặp." },
          { n: "Máy in", d: "Kết nối máy bán hàng, cài driver, cài/đổi IP bằng máy tính & điện thoại, tháo - lắp - thay giấy." },
          { n: "Két tiền", d: "Thao tác với két tiền (khóa - tự động - thủ công), kết nối thiết bị khác." },
          { n: "Máy tính khách sẵn có", d: "Tải app, một số trường hợp phát sinh, kết nối thiết bị khác." },
          { n: "Điện thoại khách sẵn có", d: "Tải app, một số trường hợp phát sinh, kết nối thiết bị khác." },
          { n: "App trên máy bán hàng (Android)", d: "Hiểu và thao tác được tất cả các mục trên app." }
        ]},
        { cat: "App bán hàng", items: [
          { n: "App FNB Quản lý" }, { n: "App FNB Phục vụ" },
          { n: "App FNB Bar/bếp" }, { n: "App FNB Thu Ngân (Windows)" }
        ]}
      ]
    },
    {
      part: "Kỹ năng khác", categories: [
        { cat: "Quy trình bán hàng", items: [
          { n: "Quy trình quán ăn, quán nhậu", d: "Hiểu và tư vấn quy trình vận hành của quán. Đâu là nỗi đau của khách. Xử lý case tình huống." },
          { n: "Quy trình quán trà sữa" }, { n: "Quy trình Bida" },
          { n: "Quy trình bán hàng mang đi" }, { n: "Quy trình bán qua app và online" }
        ]},
        { cat: "Kỹ năng sale", items: [
          { n: "Tìm kiếm khách hàng (online - offline)", d: "Được học và pass các bài test." },
          { n: "Tiếp cận khách hàng (online - offline)" },
          { n: "Kỹ năng xây dựng hệ thống AFF - CTV" },
          { n: "Kỹ năng báo giá" }, { n: "Kỹ năng xử lý từ chối" }
        ]},
        { cat: "Kỹ năng với đối thủ", items: [
          { n: "Đối thủ Offline", d: "Nhận biết các key chủ lực khi gặp đối thủ, tự tin phản hồi khi bị từ chối. Test 1-1." },
          { n: "Đối thủ Kiot" }, { n: "Đối thủ iPOS" },
          { n: "Chuyển đổi Ocha" }, { n: "Đối thủ CukCuk" }
        ]},
        { cat: "Chuyên gia vận hành", opt: true, items: [
          { n: "Tư vấn quy trình vận hành chuẩn cho khách", d: "Chuyên gia giải pháp, cung cấp giải pháp thật sự cho khách hàng.", opt: true },
          { n: "Tư vấn giảm chi phí nhân sự & tận dụng hiệu quả", opt: true },
          { n: "Tư vấn thiết lập menu hiệu quả", opt: true },
          { n: "Tư vấn phòng chống, phát hiện cheating, đá bill", opt: true },
          { n: "Tư vấn tránh thất thoát nguyên liệu", opt: true },
          { n: "Tư vấn phát triển marketing quán", opt: true }
        ]}
      ]
    }
  ]
};

/* ============================================================
   GIÁ TRỊ CỐT LÕI SAPO + thang mức độ làm chủ.
   Mỗi cấp có valueStages (mức độ kỳ vọng) tham chiếu id bên dưới.
   ============================================================ */
const VALUE_STAGES = [
  { id: "thuoc", name: "Thuộc", d: "Nhớ và phát biểu được giá trị cùng các hành vi." },
  { id: "hieu", name: "Hiểu", d: "Hiểu ý nghĩa, giải thích được vì sao quan trọng." },
  { id: "apdung", name: "Áp dụng", d: "Thể hiện đều đặn trong công việc hằng ngày." },
  { id: "lantoa", name: "Lan tỏa", d: "Làm gương và lan tỏa giá trị cho đồng đội." },
  { id: "kientao", name: "Kiến tạo", d: "Định hình, củng cố và phát triển thành văn hóa chung." }
];

const CORE_VALUES = [
  {
    name: "Tập trung vào khách hàng",
    behaviors: [
      "Lường trước mong muốn và nhu cầu để đáp ứng vượt trên mong đợi của khách hàng.",
      "Nhiệt tình, trách nhiệm đến cùng trong việc hỗ trợ khách hàng."
    ]
  },
  {
    name: "Hành động chính trực",
    behaviors: [
      "Giữ cam kết của mình.",
      "Làm đúng quy trình, quy định, không làm dối, không làm tắt.",
      "Tìm hiểu tường tận vấn đề; nghĩ và nói dựa trên thông tin đã được kiểm chứng."
    ]
  },
  {
    name: "Tôn trọng cá nhân",
    behaviors: [
      "Lắng nghe cẩn thận, cởi mở, tránh phản ứng nhanh để hiểu đúng vấn đề trước khi phản hồi.",
      "Nói thẳng thắn, trực tiếp trên tinh thần đóng góp, xây dựng.",
      "Tìm kiếm, thừa nhận sự khác biệt về con người, ý tưởng và kinh nghiệm."
    ]
  },
  {
    name: "Tinh thần đồng đội",
    behaviors: [
      "Sẵn lòng hỗ trợ, hướng dẫn, động viên để giúp đồng nghiệp hoàn thành công việc.",
      "Đặt lợi ích của Sapo lên trên lợi ích của cá nhân và nhóm của mình.",
      "Đồng thuận để đạt mục tiêu: chủ động trao đổi, phản biện trên tinh thần xây dựng để đi đến thống nhất chung; khi tập thể đã quyết định, dù cá nhân chưa hoàn toàn đồng ý vẫn cam kết hành động nhất quán. (Bổ sung 11/2025)"
    ]
  },
  {
    name: "Tạo ra sự đột phá",
    behaviors: [
      "Dám làm, không ngại khó.",
      "Nhìn xa và quyết đoán.",
      "Không ngừng học hỏi: học đi đôi với hành; sẵn sàng áp dụng cái mới; chia sẻ kiến thức.",
      "Tư duy ngược dòng: tư duy độc lập dựa trên dữ liệu, sẵn sàng chất vấn hiện trạng, tìm giải pháp đột phá và thuyết phục đồng đội."
    ]
  }
];

window.CLF = { LEVELS, GROUPS, COMPETENCIES, CHECKLISTS, VALUE_STAGES, CORE_VALUES };
