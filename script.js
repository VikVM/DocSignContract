const contractAddress = "0x23562dbCE213E26883d3A60939398A6D92d63613";
const contractAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "addToWhitelist",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "partipicant",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "docNo",
				"type": "uint256"
			}
		],
		"name": "DocumenSigned",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_docNo",
				"type": "uint256"
			}
		],
		"name": "signDocument",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "documents",
		"outputs": [
			{
				"internalType": "bool",
				"name": "exist",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "docNo",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_docNo",
				"type": "uint256"
			}
		],
		"name": "getDocument",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "docNo",
				"type": "uint256"
			},
			{
				"internalType": "address[]",
				"name": "signAddresses",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getWhitelist",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const provider = new ethers.providers.Web3Provider(window.ethereum, 97);
let signer;
let contract;

let addDocumentButton = document.querySelector("#document_button");
let addAddressButton = document.querySelector("#address_button");
let getWhitelistButton = document.querySelector("#get_whitelist");
let searchDocumentButton = document.querySelector("#search_button");

let documentCreateInputElement = document.querySelector("#document_input");
let addressInputElement = document.querySelector("#address_input");
let searchDocumentElement = document.querySelector("#search_input"); 

let whitelistElement = document.querySelector(".address-list");

let documentInfoElement = document.querySelector(".document-info");

let signedTextElement = document.querySelector(".sign-document");


provider.send("eth_requestAccounts", []).then(()=>{
  provider.listAccounts().then( (accounts) => {
      signer = provider.getSigner(accounts[0]);
      
      contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
      )
  }
  )
}
);


async function getWhitelist() {
  const whitelist = await contract.getWhitelist();

  whitelistElement.innerHTML = "";

  whitelist.forEach(item => {
    let listElement = document.createElement("li");
    listElement.innerText = item;
    whitelistElement.appendChild(listElement);
  })

}


async function addToWhitelist() {
  await contract.addToWhitelist(addressInputElement.value);

};


async function getDocument() {
  documentInfoElement.innerText = ``;

  try {
    const doc = await contract.getDocument(searchDocumentElement.value);
    documentInfoElement.innerText = `Документ найден. Подписанты:`;


    doc.signAddresses.forEach(item => {
      let listElement = document.createElement("li");
      listElement.innerText = item;
      documentInfoElement.appendChild(listElement);
    })

  } catch (error) {
    console.log(error)
    documentInfoElement.innerText = `Документ не найден`;
  }
};

async function signDocument() {
    signedTextElement.textContent = "";

    try {
      const result = await contract.signDocument(documentCreateInputElement.value);
      const rc = await result.wait(2);
      signedTextElement.textContent = "Документ подписан";
      
    } catch (error) {
      signedTextElement.textContent = "Ошибка, возможно вашего адреса нет в белом списке. Добавьте свой адрес ниже";
      console.log(error)
    }
}


getWhitelistButton.addEventListener("click", (e) => {
  e.preventDefault();
  getWhitelist();
});

addAddressButton.addEventListener("click", (e) => {
  e.preventDefault();
  addToWhitelist();
});

searchDocumentButton.addEventListener("click", (e) => {
  e.preventDefault();
  getDocument();
});

addDocumentButton.addEventListener("click", (e) => {
  e.preventDefault();
  signDocument();
});

