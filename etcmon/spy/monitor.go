package etcmon

import (
	"encoding/json"
	"github.com/fsnotify/fsnotify"
	"github.com/jpillora/ansi"
	"io"
	"log"
	"os"
	"path"
)

type conf struct {
	Port           string
	DestinationDir string
	RootDir        string
	paths          []string
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
	m.httper = &httpServer{port: m.config.Port}
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
	m.watch(m.paths)
	m.listenEvents()
	m.httpServer.start()
}

func (m *Monitor) watch(paths) {
	for _, path := range paths {
		abspath := trailJoin(m.rootDir, path)
		if err := m.wathcer.Add(abspath); err != nil {
			m.debug("watch failed: %s", err)
			m.stopWith(fmt.Errorf("%s (%s)", err, path))
			return
		}
	}
}
func (m *Monitor) listenEvents() {
	for {
		select {
		case event := <-m.watcher.Events:
			go m.handleNotifyEvent(&event)
		case err := <-m.watcher.Errors:
			if err != nil {
				m.Debug("watch error:%s", err)
			}
		case paths := <-m.httpServer.paths:
			go m.watch(paths)
		}
	}
}

func (m *Monitor) handleNotifyEvent(event *fsnotify.Event) {
	path := event.Name
	if path == "" {
		return
	}
	if event.Op&fsnotify.Create == fsnotify.Create ||
		event.Op&fsnotify.Write == fsnotify.Write {
		if event.Op&fsnotify.Create == fsnotify.Create {
			ioutil.mkdir(trailJoin(m.conf.DestinationDir, path))
		}
		ioutil.copy(destinationDir)
	}
	if event.Op&fsnotify.Rename == fsnotify.Rename {
		ioutil.rename(trailJoin(m.conf.DestinationDir, path), newname)
	}
	if event.Op&fsnotify.Remove == fsnotify.Remove {
		ioutil.remove(trailJoin(m.conf.DestinationDir, path))
	}
}

func trailJoin(paths ...string) string {
	p := filepath.Join(paths)
	info, err := os.stat(p)
	if (err == nil && info.IsDir()) ||
		strings.HasSuffix(paths[len(paths)-1], "/") {
		p += "/"
	}
	return p
}
func (m *Monitor) info(f string, args ...interface{}) {
	if m.config.level > 1 {
		m.log.Printf(f, args...)
	}
}

func (m *Monitor) debug(f string, args ...interface{}) {
	if m.config.level > 0 {
		m.log.Printf(f, args...)
	}
}

//helpers

type colorWriter ansi.Attribute

func newColorWriter(letter string) colorWriter {
	if letter == "black" {
		return colorWriter(ansi.Black)
	}
	switch letter[:1] {
	case "c":
		return colorWriter(ansi.Cyan)
	case "m":
		return colorWriter(ansi.Magenta)
	case "y":
		return colorWriter(ansi.Yellow)
	case "k":
		return colorWriter(ansi.Black)
	case "r":
		return colorWriter(ansi.Red)
	case "g":
		return colorWriter(ansi.Green)
	case "b":
		return colorWriter(ansi.Blue)
	case "w":
		return colorWriter(ansi.White)
	default:
		return colorWriter(ansi.Green)
	}
}

func (c colorWriter) Write(p []byte) (n int, err error) {
	os.Stdout.Write(ansi.Set(ansi.Attribute(c)))
	os.Stdout.Write(p)
	os.Stdout.Write(ansi.Set(ansi.Reset))
	return len(p), nil
}
