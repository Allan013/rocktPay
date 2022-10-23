import "./css/index.css"
import IMask from 'imask';


const ccBgColor1 = document.querySelector('.cc-bg svg g g:nth-child(1) path');
const ccBgColor2 = document.querySelector('.cc-bg svg g g:nth-child(2) path');
const ccBgLogo = document.querySelector('.cc-logo span:nth-child(2) img');

function setCardType(type) {
    const colors = {
        'visa' :['#436D99', '#2D57F2'],
        'mastercard' : ['#DF6F29', '#c69347'],
    }

    ccBgColor1.setAttribute('fill', colors[type][0]);
    ccBgColor2.setAttribute('fill', colors[type][1]);
    ccBgLogo.setAttribute('src', `cc-${type}.svg`)
}

window.setCardType = setCardType

const securityCode = document.querySelector('#security-code');
const securityCodePattern = {
    mask: '0000'
}

const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDate = document.querySelector('#expiration-date');
const expirationDatePattern = {
    mask: 'MM{/}YY',
    blocks: {
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2)
        },
        MM: {
            mask : IMask.MaskedRange,
            from: 1,
            to: 12
        }
    }
    
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector('#card-number');
const cardNumberPatter = {
    mask : [
        {
            mask: '0000 0000 0000 0000',
            regex:/^4\d{0,15}/,
            cardType: 'visa'
        },
        {
            mask: '0000 0000 0000 0000',
            regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardType: 'mastercard'
        },
        {
            mask: '0000 0000 0000 0000',
            cardType: 'default'
        },
    ],
    dispatch: function(appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g,'');
        const foundMask = dynamicMasked.compiledMasks.find(function(item){
            return number.match(item.regex)
        })
        return foundMask;
    },
}
    
const cardNumberMasked = IMask(cardNumber, cardNumberPatter);

const addButton = document.querySelector('#add-cart');
addButton.addEventListener('click', (event)=>{
    event.preventDefault();
});

const cartHolder = document.querySelector('#card-holder');
cartHolder.addEventListener('input', ()=>{
    const ccHolder = document.querySelector('.cc-holder .value');
    console.log(cartHolder.value.length)

    ccHolder.innerHTML = cartHolder.value.length === 0 ? "fulano da silva" : cartHolder.value
});

securityCodeMasked.on("accept", ()=>{
    updateSecurityCode(securityCodeMasked.value)
});

function updateSecurityCode(code) {
    const ccSecurity = document.querySelector('.cc-security .value');
    ccSecurity.innerHTML = code.length === 0 ? '123' : code
}

cardNumberMasked .on('accept',()=>{
    const cardType = cardNumberMasked.masked.currentMask.cardType
    setCardType(cardType)
    updateCardNumber(cardNumberMasked.value)
});

function updateCardNumber(number){
    const ccNumber = document.querySelector('.cc-number');
    ccNumber.innerHTML = number.length === 0 ? '1234 5678 9012 3456' : number
}

expirationDateMasked.on('accept', ()=>{
    updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date){
    const ccExpiration = document.querySelector('.cc-extra .value')
    ccExpiration.innerHTML = date.length === 0 ? '02/32' : date
}


function typeWrite(element){
    let textArray = element.innerHTML.split('');
    element.innerHTML = '';
    textArray.forEach((letter, a) =>{
        setTimeout(()=> element.innerHTML += letter ,75 * a);
    });
}

const title = document.querySelector('.cc-information')
 
typeWrite(title);

setTimeout(()=>{
    title.style.display = 'none'
    ccForm.style.marginTop = '0px'
},10000)

const ccForm = document.querySelector('form')