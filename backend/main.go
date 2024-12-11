package main

import (
	"log"
	"net/http"
	"github.com/googollee/go-socket.io"
)

func main() {
	// สร้าง Socket.IO server
	server := socketio.NewServer(nil)

	// ตั้งค่าการเชื่อมต่อ
	server.OnConnect("/", func(s socketio.Conn) error {
		log.Println("Connected:", s.ID())
		return nil
	})

	server.OnEvent("/", "message", func(s socketio.Conn, msg string) {
		log.Println("Message received:", msg)
		s.Emit("reply", "Server received: "+msg)
	})

	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		log.Println("Disconnected:", s.ID(), "Reason:", reason)
	})

	// ใช้ Middleware สำหรับจัดการ CORS
	corsMiddleware := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173") // ระบุ Origin ของ Frontend
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}
			next.ServeHTTP(w, r)
		})
	}

	// เส้นทางสำหรับ Socket.IO
	http.Handle("/socket.io/", corsMiddleware(server))

	// Static files (หากจำเป็น)
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	// เริ่มเซิร์ฟเวอร์
	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
