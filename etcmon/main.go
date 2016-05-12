package main

import (
	"flag"
	"fmt"
	etcmon "github.com/kayw/etcmon/spy"
	"os"
	"os/signal"
	"time"
)

var VERSION = "0.0.0-src"
var help = `
	Usage: etcmon [options] ...args

	monitor the specifieced configs in etc directory, when some file changed, copy the file to home registry directory
	receive http request for appending new watched file or directory

		Options:
		--config *.json Watch file or directory configuration
		--verbose log the watch program informations
	`

func main() {
	confJson := flag.String("config", "config.json", "")
	verbose := flag.Bool("verbose", false, "")
	version := flag.Bool("version", false, "")
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, help)
	}
	if *version {
		fmt.Println(VERSION)
		os.Exit(1)
	}
	flag.Parse()
	args := flag.Args()
	monitor, err := etcmon.New(*confJson, *verbose)
	if err != nil {
		fmt.Println(os.Stderr, "\n\t%s\n", err)
		flag.Usage()
		os.Exit(1)
	}
	//stop on CTRL+C
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, os.Interrupt, os.Kill)
	go func() {
		<-sig
		w.Stop()
	}()

	//start watching
	monitor.Start()
	//block
	if err := moinotr.Wait(); err != nil {
		os.Exit(1)
	}
}
