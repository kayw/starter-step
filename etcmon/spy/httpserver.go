package etcmon

import (
	"fmt"
	"net/http"
)

type httpServer struct {
	paths chan []string
}

func (hs *httpServer) handleWatch(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		hs.paths <- r.Query.paths
	}
	fmt.Printf(w, "OK")
}
func (hs *httpServer) start(port string) {
	http.HandleFunc("/watch", hs.handleWatch)
	http.ListenAndServe(port, nil)
}
