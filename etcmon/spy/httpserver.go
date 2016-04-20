package etcmon

import (
	"fmt"
	"net/http"
)

type watchInfo struct {
	root  string
	paths []string
}
type httpServer struct {
	hotwatch chan<- watchInfo
}

func (hs *httpServer) handleWatch(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		wi := watchInfo{
			root:  r.Query.root,
			paths: r.Query.paths,
		}
		hs.hotwatch <- wi
	}
	fmt.Printf(w, "OK")
}
func (hs *httpServer) start(port string) {
	hs.hotwatch = make(chan<- watchInfo)
	http.HandleFunc("/watch", hs.handleWatch)
	http.ListenAndServe(port, nil)
}
