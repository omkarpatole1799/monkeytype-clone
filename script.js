const paragraph =
  "lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore accusantium sequi recusandae. Nihil delectus, vel in obcaecati corrupti odit voluptatem quas, sed provident dolorum ipsa animi atque. Ab aut nobis nostrum molestiae exercitationem sapiente voluptatibus, velit modi libero quasi porro. Odit aliquid neque quibusdam nisi nihil repellendus quo corrupti tenetur!";

class NewTypingGame {
  typingContainer = null;
  currentWord = null;
  currentLetter = null;

  constructor() {
    this.typingContainer = document.querySelector("#quote");

    this.startNew();
    document.addEventListener("keydown", this._handleTyping.bind(this));
  }

  startNew() {
    this.typingContainer.innerHTML = "";
    paragraph.split(" ").forEach(word => {
      this.typingContainer.innerHTML += this._formatWord(word);
    });

    this._addClass(document.querySelector(".word"), ["current"]);
    this._addClass(document.querySelector(".letter"), ["current"]);
  }

  _addClass(el, className) {
    className.forEach(_class => {
      if (!el) return;
      el.classList.add(_class);
    });
  }

  _removeClass(el, className) {
    className.forEach(_class => {
      if (!el) return;
      el.classList.remove(_class);
    });
  }

  _formatWord(word) {
    // Add a span for each letter and a space at the end
    return `<div class="word">${this._formatLetter(
      word
    )}<span class="space letter"></span></div>`;
  }

  _formatLetter(word) {
    return word
      .split("")
      .map(letter => {
        return `<span class="letter">${letter}</span>`;
      })
      .join("");
  }

  _isCtrlBackspace(e) {
    if (e.ctrlKey && e.key === "Backspace") {
      return true;
    }
    return false;
  }

  _isCurrentWordAllCorrect() {
    if (this.currentWord) {
      const isAnyIncorrectInPreviousWord = [
        ...this.currentWord.querySelectorAll(".letter.incorrect:not(.space)"),
      ];
      console.log(
        isAnyIncorrectInPreviousWord,
        "==isAnyIncorrectInPreviousWord=="
      );
      return false;
    }
    return true;
  }

  _isPreviousWordAllCorrect() {
    if (this.currentWord?.previousElementSibling) {
      const isAnyIncorrectInPreviousWord = [
        ...this.currentWord.previousElementSibling.querySelectorAll(
          ".letter.incorrect:not(.space)"
        ),
      ];
      console.log(
        isAnyIncorrectInPreviousWord,
        "==isAnyIncorrectInPreviousWord=="
      );
      return false;
    }
    return true;
  }

  _handleCtrlBackspace() {
    this.currentWord.querySelectorAll(".letter").forEach(_el => {
      console.log(_el, "==_el==");
      this._removeClass(_el, ["current", "correct", "incorrect"]);
    });

    // check is there is previous word
    const previousWord = this.currentWord.previousElementSibling;

    if (previousWord) {
      this._removeClass(this.currentWord, ["current"]);
      this._addClass(previousWord, ["current"]);
      this._addClass(previousWord.lastElementChild, ["current"]);
    } else {
      this._addClass(this.currentWord.firstElementChild, ["current"]);
    }
  }

  _handleSpaceKey() {
    const lettersToMarkIncorrect = [
      ...document.querySelectorAll(".word.current .letter:not(.correct)"),
    ];
    if (lettersToMarkIncorrect) {
      lettersToMarkIncorrect.forEach(letter => {
        this._addClass(letter, ["incorrect"]);
      });
    }

    this._removeClass(this.currentWord, ["current"]);
    this._removeClass(this.currentLetter, ["current"]);

    this._addClass(this.currentWord.nextElementSibling, ["current"]);
    this._addClass(this.currentWord.nextElementSibling.firstElementChild, [
      "current",
    ]);
  }

  _handleBackspacKey() {
    // TODO: (Omkar) if all letters are correct for current word dont allow backspace

    const isPreviousSiblingAvailable =
      this.currentLetter?.previousElementSibling;
    console.log(isPreviousSiblingAvailable, "==isPreviousSiblingAvailable==");

    // const isPreviousSpace = this.currentLetter

    if (isPreviousSiblingAvailable) {
      this._removeClass(this.currentLetter, [
        "correct",
        "incorrect",
        "current",
      ]);
      this._addClass(this.currentLetter.previousElementSibling, ["current"]);
      this._removeClass(this.currentLetter.previousElementSibling, [
        "correct",
        "incorrect",
      ]);
      return;
    }

    const previousWord = this.currentWord.previousElementSibling;
    console.log(previousWord, "==previousWord==");
    if (previousWord) {
      this._removeClass(this.currentWord, ["current"]);
      this._removeClass(this.currentLetter, [
        "current",
        "correct",
        "incorrect",
      ]);

      this._addClass(previousWord, ["current"]);
      this._addClass(previousWord.lastElementChild, ["current"]);
      this._removeClass(previousWord.lastElementChild, [
        "correct",
        "incorrect",
      ]);
    }
  }

  _handleLetterChecking(key, expectedLetter) {
    if (this.currentLetter) {
      this._addClass(
        this.currentLetter,
        key === expectedLetter ? ["correct"] : ["incorrect"]
      );
      this._removeClass(this.currentLetter, ["current"]);
      this._addClass(this.currentLetter?.nextSibling, ["current"]);
    }
  }

  _handleTyping(e) {
    const key = e.key;

    this.currentLetter = document.querySelector(".letter.current");
    this.currentWord = document.querySelector(".word.current");

    const expectedLetter = this.currentLetter?.innerHTML;

    const isLetter = key.length === 1 && key !== " ";
    const isSpaceKey = key === " ";
    const isBackspace = key === "Backspace";

    if (this._isCtrlBackspace(e)) {
      this._handleCtrlBackspace();
      return;
    }

    if (isLetter && expectedLetter) {
      this._handleLetterChecking(key, expectedLetter);
    }

    if (isSpaceKey) {
      this._handleSpaceKey();
    }

    if (isBackspace) {
      this._handleBackspacKey();
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new NewTypingGame();
});
