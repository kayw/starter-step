package etcmon

import (
	"encoding/json"
	"github.com/fsnotify/fsnotify"
	"github.com/jpillora/ansi"
	"io"
	"log"
	"os"
	"path"
	"sync"
)

type watched struct {
	root  string
	paths []string
}
type conf struct {
	Port           string    `json: "port"`
	DestinationDir string    `json: "dest"`
	Level          int       `json: "level"`
	WatchedPaths   []watched `json: "watched"`
}
type Monitor struct {
	config   conf
	httper   *httpServer
	watcher  *fsnotify.Watcher
	logger   *log.Logger
	watching chan error
	closer   sync.Once
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
	m.watching = make(chan error)
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
	m.log = log.New(logWriter, "etcmon ", log.Ldate|log.Ltime|log.Lmicroseconds)
	for _, watchp := range m.config.WatchPaths {
		m.watch(watchp.root, watchp.paths)
	}
	m.listenEvents()
	m.httpServer.start()
}

func (m *Monitor) Wait() {
	err := <-s.watching
	if err != nil {
		m.info("Error: %v", err)
	}
	return err
}

func (m *Monitor) Stop() {
	m.stopWith(nil)
}

func (m *Monitor) watch(root, paths) {
	for path := range paths {
		abspath := trailJoin(root, path)
		if err := m.wathcer.Add(abspath); err != nil {
			m.debug("watch failed: %s", err)
			m.stopWith(fmt.Errorf("%s (%s)", err, abspath))
			return
		}
	}
}

func (m *Monitor) stopWith(err error) {
	m.closer.Do(func() {
		m.watcher.Close()
		s.watching <- err
		close(s.watching)
	})
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
		case hotwatch := <-m.httpServer.hotwatch:
			go m.watch(hotwatch.root, hotwatch.paths)
		}
	}
}

func (m *Monitor) handleNotifyEvent(event *fsnotify.Event) {
	path := event.Name
	if path == "" {
		return
	}
	// Check to see if original path is directory or file
	fi, err := os.Stat(path)
	if err != nil {
		m.info("stat %s error %s", path, err)
		return
	}
	destpath := trailJoin(m.conf.DestinationPath, path)
	if event.Op&fsnotify.Create == fsnotify.Create {
		if fi.IsDir() {
			if err := createDirectory(destpath); err != nil {
				m.info("create directory %s error %s", destpath, err)
			}
		} else {
			// this file's directory is guaranteed to be created
			if _, err := CopyFile(destpath, path); err != nil {
				m.info("copy file %s error %s", path, err)
			}
		}
	}
	if event.Op&fsnotify.Rename == fsnotify.Rename {
		m.info("path %s renamed", path)
	}
	if event.Op&fsnotify.Write == fsnotify.Write {
		if fi.IsDir() {
			return
		}
		if _, err := CopyFile(destpath, path); err != nil {
			m.info("copy file %s error %s", path, err)
		}

	}
	if event.Op&fsnotify.Remove == fsnotify.Remove {
		if fi.IsDir() {
			if err := os.RemoveAll(destdir); err != nil {
				m.info("remove dir %s error %s", destdir, err)
			}
		} else {
			if err := os.Remove(destpath); err != nil {
				m.info("remove file %s error %s", destdir, err)
			}
		}
	}
}

//https://groups.google.com/forum/#!topic/golang-nuts/JNyQxQLyf5o
//http://stackoverflow.com/questions/21060945/simple-way-to-copy-a-file-in-golang
func CopyFile(dst, src string) (int64, os.Error) {
	sf, err := os.Open(src)
	if err != nil {
		return 0, err
	}
	defer sf.Close()
	df, err := os.Create(dst)
	if err != nil {
		return 0, err
	}
	defer df.Close()
	return io.Copy(df, sf)
}
func createDirectory(dir string) error {
	dir = dir + "/"
	return os.MkdirAll(dir, 700)
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
	if m.config.Level > 1 {
		m.log.Printf(f, args...)
	}
}

func (m *Monitor) debug(f string, args ...interface{}) {
	if m.config.Level > 0 {
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
