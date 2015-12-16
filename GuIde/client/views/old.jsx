import React, { Component } from 'react';
export default class OldView extends Component {
  render() {
    return (
<div id="playground" className="play-container">
  <div className="play-controls">
    <div className="play-buttons">
      <a className="run" title="run code">Run</a>
      <a className="fmt" title="format">Format</a>
    </div>
    <div className="play-language">
      <select name="play-lang-selection" id="play-lang-select" /* onChange="" */>
        <option value="go">go</option>
        <option value="rust">rust</option>
        <option value="c+">c/c++</option>
        <option value="py">python</option>
      </select>
      {/* play-lang-compiler */}
    </div>
  </div>
  <div className="play-input">
    <textarea className="play-code-area" itemProp="description" name="code" autoCorrect="off" autoComplete="off" autoCapitalize="off" spellCheck="false">
    </textarea>
  </div>
  <div className="play-output"></div>
</div>
    );
  }
}
