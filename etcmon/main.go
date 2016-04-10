package main

import (
	"flag"
	"fmt"
	"os"
	"time"
)

var help = `
	Usage: etcmon [options] ...args

	monitor the specifieced configs in etc directory, when some changed, copy the file to home registry directory
	receive http request for appending new watched file or directory

		Options:
		--config *.json Watch file or directory configuration
		--verbose log the watch program informations
	`

func main() {
	confJson := flag.String("config", "config.json", "")
	verbose := flag.Bool("verbose", false, "")
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, help)
	}
	flag.Parse()
	args := flag.Args()
	//stop on CTRL+C
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt, os.Kill)
	go func() {
		<-sig
		w.Stop()
	}()

	//start watching
	w.Start()
	//block
	if err := w.Wait(); err != nil {
		os.Exit(1)
	}
}
