var Chain3 = require('chain3');
var chain3;

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  // var chain3 = new Chain3();
  window.addEventListener('load', function() {
    var results

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof chain3 !== 'undefined') {
      chain3 = new Chain3(chain3.currentProvider);

      results = {
        chain3: chain3
      }

      console.log('Injected chain3 detected.');

      resolve(results)
    } else {
      // set the provider you want from Chain3.providers
      chain3 = new Chain3(new Chain3.providers.HttpProvider("http://localhost:8545"));

      results = {
        chain3: chain3
      }

      console.log('No chain3 instance injected, using Local chain3.');
      resolve(results)
    }

    // chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));


    window.chain3 = chain3;
  })
})

export default getWeb3
