import css from 'style.css';

let el = document.getElementById('blockJS')
let button = document.createElement('button')
let t = document.createTextNode('Pay with Bitcoin')
button.appendChild(t)
button.classList.add('blockJS-Button')
el.appendChild(button)

let wrapperEl = document.createElement('div')
wrapperEl.id = 'blockJSWrapper'
wrapperEl.classList.add('blockJS-Wrapper')
wrapperEl.innerHTML = "<img src='https://project.blockpos.io/_project/img/logo-b.png' class='blockJS-Logo' width='200'><br><br><a href='https://project.blockpos.io' target='blank' class='blockJS-Credits'>Powered by Block!</a>";
el.appendChild(wrapperEl)

let barcodeEl = document.createElement('div')
barcodeEl.id = 'blockJSQRCode'
barcodeEl.classList.add('blockJS-QRCode')

let detailsEl = document.createElement('div')
detailsEl.id = 'blockJSDetails'
detailsEl.classList.add('blockJS-Details')

wrapperEl.appendChild(barcodeEl)
wrapperEl.appendChild(detailsEl)

var onSuccess = () => {}
var onError = () => {}

let blockJSlisteningRID='';
let blockJSInterval;

function registerListener(success, error) {
   blockJSInterval = setInterval(() => {
      var xhr = new XMLHttpRequest()
      xhr.open("POST", "https://blockpos.io/payments/check", true)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(JSON.stringify({
          rid: blockJSlisteningRID
      }))
      xhr.onload = function() {
        var response = JSON.parse(this.responseText)
        var data = response['data'];
        if(data['status'] == "Paid"){
          clearInterval(blockJSInterval)
          wrapperEl.style.display = 'none'
          document.body.classList.remove('blockJS-Blur')
          success('Request paid!')
        } else if (data['status'] == 'Expired'){
          clearInterval(blockJSInterval)
          wrapperEl.style.display = 'none'
          document.body.classList.remove('blockJS-Blur')
          error('Request expired!')
        } else if (data['status'] === undefined){
          clearInterval(blockJSInterval)
          wrapperEl.style.display = 'none'
          document.body.classList.remove('blockJS-Blur')
          error('Something goes wrong!')
        }
      }
    }, 2500)
}

function showQRCode(qrcodeIMG) {
    wrapperEl.style.display = 'block'
    document.body.classList.add('blockJS-Blur')
    barcodeEl.style.backgroundImage = "url('"+qrcodeIMG+"')"
}

class BlockJS {
    static init(el) {
        this.el = el
        if(this.el.getAttribute('data-amount')){
            this.amount=this.el.getAttribute('data-amount')
        }
        button.addEventListener('click', e => {
            if (this.hasStarted === true) {
                return alert('cannot submit more than one payment at the same time')
            }
            this.hasStarted = true
            if (!this.pk) {
                return alert('No PK provided')
            }

            if (!this.amount) {
                return alert('No amount set')
            }

            console.log('requesting a new payment with PK: ' + this.pk + ', Amount: ' + this.amount)
            var xhr = new XMLHttpRequest()
            xhr.open("POST", "https://blockpos.io/api/init", true)
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.send(JSON.stringify({
                pk: this.pk,
                amount: this.amount
            }))
            xhr.onload = function() {
              var response = JSON.parse(this.responseText)
              if(!response['error']){
                  var data = response['data']
                  blockJSlisteningRID = data['request_id']
                  //console.log(data);
                  //ATTACHING LABELS
                  detailsEl.innerHTML="<img width='30' class='blockJS-loader' src='data:image/png;base64,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'>";
                  
                  var mainLabel = document.createElement('h1')
                  mainLabel.innerHTML = "Pay "+data['request']+data['currency']+" with BTC";
                  detailsEl.appendChild(mainLabel)
                
                  var amountLabel = document.createElement('h2')
                  amountLabel.innerHTML = "Please send "+data['amount_btc']+" BTC at"
                  detailsEl.appendChild(amountLabel)
                  
                  var addressLabel = document.createElement('h5')
                  addressLabel.innerHTML =  data['address']
                  detailsEl.appendChild(addressLabel)

                  var priceLabel = document.createElement('h3')
                  priceLabel.innerHTML = "BTC price is "+data['price']+" "+data['currency']
                  detailsEl.appendChild(priceLabel)

                  var cancelLabel = document.createElement('div')
                  cancelLabel.innerHTML = "<button class='blockJS-Button' onClick='BlockJS.cancelRequest()'>Go back</button>";
                  detailsEl.appendChild(cancelLabel);

                  showQRCode(data['qrcode'])
                  registerListener(onSuccess, onError)
              }else{
                console.log(data['error']);
              }
            }
        })
    }

    static cancelRequest() {
        blockJSlisteningRID = ''
        wrapperEl.style.display = 'none'
        clearInterval(blockJSInterval)
        this.hasStarted = false
        document.body.classList.remove('blockJS-Blur')
        onError('User canceled the request!')
    }

    static setPk(pk) {
        this.pk = pk
    }

    static setAmount(amount) {
        this.amount = amount
    }

    static onPaymentReceipt(fn) {
        onSuccess = fn
    }

    static onPaymentFailure(fn) {
        onError = fn
    }
}

BlockJS.init(el)

window.BlockJS = BlockJS
