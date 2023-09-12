const spellCopy = document.getElementById('copyb') as HTMLButtonElement
const spellClear = document.getElementById('clearb') as HTMLButtonElement
const spellArea = document.getElementById('spelli') as HTMLTextAreaElement
const spellFormat = document.getElementById('formatb') as HTMLButtonElement
const spellButtonListen = document.getElementById('listenb') as HTMLButtonElement

const recordsBanner = document.getElementById('records') as HTMLDivElement
const recordsButton = document.getElementById('recordsb') as HTMLButtonElement
const recordsClose = document.getElementById('closeb') as HTMLButtonElement
const recordsContainer = document.getElementById('records_list') as HTMLDivElement

const recognition = new webkitSpeechRecognition()
let end = false

const recordsList: string[] = []

recognition.onend = () => {
  if (!end) {
    console.log('end')
    oldText = text + '\n'
    listen()
    end = false
  } else {
    console.log('end')
    end = false
  }
}

let format = false
let text = ''
let oldText = ''

function add(newText: string) {
  text += newText
}

function listen() {
  recognition.lang = 'es-ES'
  recognition.continuous = true
  recordsList.push('')
  recognition.onresult = event => {
    text = oldText
    for (const result of event.results) {
      add(result[0].transcript)
      if (result.isFinal && format) {
        text += ('\n')
      } else {
        text += (' ')
      }
      spellArea.scrollTop = spellArea.scrollHeight
      recordsList[recordsList.length - 1] = text
    }
    spellArea.value = text
    addRecords()
  }
  recognition.start()
  spellButtonListen.classList.add('active')
  spellButtonListen.removeEventListener('click', listen)
  spellButtonListen.addEventListener('click', stop)
}

function comprobe() {
  recognition.continuous
}

function stop() {
  spellButtonListen.removeEventListener('click', stop)
  spellButtonListen.addEventListener('click', listen)
  spellButtonListen.classList.remove('active')
  end = true
  recognition.stop()
}

function openRecords() {
  recordsBanner.classList.remove('none')
  recordsBanner.classList.add('visible')
  addRecords()
}

function addRecords() {
  const news = recordsList.map((record) => {
    if (record.length === 0) return ''
    return `<li class="record">${record}<div class="copy_icon">📋</div></li>`
  })
  if (news.length === 0) {
    news.push('<div>Nothing 🦆</div>')
  }
  recordsContainer.innerHTML = news.reverse().join('')

  document.querySelectorAll('.record').forEach(record => {
    record.addEventListener('click', recordCopy)
  })
}

function close () {
  recordsBanner.classList.add('none')
  recordsBanner.classList.remove('visible')
}

function recordCopy(e: Event) {
  const target = e.target as HTMLLIElement
  navigator.clipboard.writeText(target.innerText)
}

function copy() {
  navigator.clipboard.writeText(spellArea.value)
}

function clear() {
  spellArea.value = ''
}

function setFormat() {
  format = !format
  if (format) {
    spellFormat.classList.add('active')
  } else {
    spellFormat.classList.remove('active')
  }
}

spellCopy.addEventListener('click', copy)
spellClear.addEventListener('click', clear)
spellFormat.addEventListener('click', setFormat)
spellButtonListen.addEventListener('click', listen)

recordsButton.addEventListener('click', openRecords)
recordsClose.addEventListener('click', close)