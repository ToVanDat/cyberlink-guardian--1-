CyberLink Guardian
CyberLink Guardian là một ứng dụng web bảo mật được xây dựng trên nền tảng React và TypeScript, tích hợp mô hình ngôn ngữ lớn (LLM) để phân tích rủi ro của các liên kết URL. Dự án tập trung vào việc nhận diện các hành vi lừa đảo (phishing) và mã độc thông qua kỹ thuật Prompt Engineering thay vì chỉ dựa vào cơ sở dữ liệu tĩnh truyền thống.

🚀 Tính năng kỹ thuật
AI-Powered Analysis: Tích hợp SDK @google/genai để tương tác trực tiếp với mô hình gemini-2.5-flash. Triển khai cấu trúc JSON Schema đầu ra để đảm bảo dữ liệu trả về từ AI luôn nhất quán và dễ dàng xử lý ở Frontend.

Real-time Security News: Tự động tổng hợp và tóm tắt các tin tức an ninh mạng mới nhất bằng AI, giúp người dùng cập nhật thông tin về các lỗ hổng bảo mật zero-day.

Persistent Storage: Quản lý lịch sử quét URL thông qua LocalStorage API, cho phép người dùng xem lại kết quả phân tích mà không cần gọi lại API.

Responsive UI/UX: Giao diện được thiết kế với Tailwind CSS theo phong cách Modern Dark Theme, hỗ trợ phản hồi trạng thái (loading, error) trực quan.

Web Share Integration: Sử dụng Web Share API để cho phép người dùng chia sẻ nhanh các cảnh báo bảo mật tới các nền tảng khác.

🛠️ Stack công nghệ
Frontend: React 19 (Hooks), TypeScript.

Build Tool: Vite (tối ưu hóa tốc độ bundle và hot reload).

AI: Google Gemini AI (Generative AI SDK).

Styling: Tailwind CSS.

State Management: React State & Effect Hooks.

⚙️ Cài đặt và Cấu hình
Clone dự án:

Bash
git clone <your-repo-url>
cd cyberlink-guardian
Cài đặt dependencies:

Bash
npm install
Cấu hình biến môi trường:
Tạo tệp .env.local tại thư mục gốc và thêm API Key:

Đoạn mã
GEMINI_API_KEY=your_api_key_here
Chạy môi trường phát triển:

Bash
npm run dev
📂 Cấu trúc mã nguồn tiêu biểu
src/services/geminiService.ts: Chứa logic nghiệp vụ chính, định nghĩa hệ thống Prompt và cấu trúc Schema cho AI.

src/components/: Hệ thống component tái sử dụng (Atomic Design nhẹ).

src/types.ts: Định nghĩa chặt chẽ các Interface và Enum (SafetyStatus, AnalysisResult) để đảm bảo Type-safety cho toàn bộ ứng dụng.

vite.config.ts: Cấu hình Alias và xử lý biến môi trường an toàn.

💡 Điểm nổi bật về kỹ thuật
Trong dự án này, tôi đã giải quyết vấn đề dữ liệu không cấu trúc từ AI bằng cách sử dụng thuộc tính responseMimeType: "application/json" và định nghĩa responseSchema. Điều này giúp ứng dụng hoạt động ổn định, tránh được các lỗi parse dữ liệu thường gặp khi làm việc với LLM.
