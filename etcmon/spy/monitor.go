package etcmon

import (
	"encoding/json"
	"fsnotify"
	"io"
	"log"
	"os"
	"path"
)

type conf struct {
	port    string
	rootDir string
	paths   []string
}
type Monitor struct {
	config  conf
	httper  *httpServer
	watcher *fsnotify.Watcher
	logger  *log.Logger
}

func New(configJson string, verbose bool) (*Monitor, error) {
	m := &Monitor{}
	err := json.Unmarshal([]byte(configJson), &m.config)
	if err != nil {
		return nil, err
	}
	m.watcher, err = fsnotify.NewWatcher()
	if err != nil {
		return nil, err
	}
	m.httper = &httpServer{port: m.config.port}
	return m
}

func (m *Monitor) Start() {
	//initialize log
	var logWriter io.Writer
	if m.LogColor != "" {
		logWriter = newColorWriter(m.LogColor)
	} else {
		logWriter = os.Stdout
	}
	m.log = log.New(logWriter, "spy ", log.Ldate|log.Ltime|log.Lmicroseconds)
	m.watch()
	m.listenEvents()
	m.httpServer.start()
}

func (m *Monitor) watch() {
	for _, path := range m.paths {
		abspath := trailJoin(m.rootDir, path)
		if err := m.wathcer.Add(abspath); err != nil {
			m.debug("watch failed: %s", err)
			m.stopWith(fmt.Errorf("%s (%s)", err, path))
			return
		}
	}
}
func (m *Montor) listenEvents() {
	for {
		select {
		case event := <-m.watcher.Events:
			go m.handleNotifyEvent(event)
		case err := <-m.watcher.Errors:
		case paths := <-m.httpServer.paths:
		}
	}
}

func trailJoin(paths ...string) string {
	p := filepath.Join(paths)
	info, err := os.stat(p)
	if (err == nil && info.IsDir()) ||
		strings.HasSuffix(paths[len(paths)-1], "/") {
		p += "/"
	}
	return s
}
