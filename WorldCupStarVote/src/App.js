import React, {
    Component
} from 'react'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'

import getChain3 from './utils/getChain3'
import './App.css'

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            storageValue: 0,
            web3: null,
            chain3: null,
            contract: null,
            account: null,
            myEvent: null,
            stars:null,
            tokenaddress:null,
        }
    }

    componentWillMount() {
        getChain3
            .then(results => {
                this.setState({
                    chain3: results.chain3
                })
                // console.log(this.state.chain3);
                // var coinbase = this.state.chain3.mc.coinbase;
                var account = this.state.chain3.mc.accounts[3];
                this.setState({
                        account: account
                    })
                this.instantiateContract()

            })
            .catch(() => {
                console.log('Error finding chain3.')
            })
    }

    componentDidMount() {
        this.ListenPanels();
    }

    instantiateContract() {

        var tokenabi = '[ { "constant": false, "inputs": [ { "name": "_starID", "type": "uint256" } ], "name": "vote", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x7cf2ca22c25ee57b4e2cb10e09d6771841033944" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "starsCount", "outputs": [ { "name": "", "type": "uint256", "value": "5" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "voters", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "voteMapping", "outputs": [ { "name": "id", "type": "uint256", "value": "0" }, { "name": "name", "type": "string", "value": "" }, { "name": "country", "type": "string", "value": "" }, { "name": "voteCount", "type": "uint256", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "_candidateId", "type": "uint256" } ], "name": "votedEvent", "type": "event" } ]';

        var tokenContract = this.state.chain3.mc.contract(JSON.parse(tokenabi));
        var tokenaddress = '0xbF7cb96165b567Ce1990BBa01D65ECE22954c1b3';
        this.setState({
            tokenaddress
        });

        var tcalls = tokenContract.at(tokenaddress);
        this.setState({
            contract: tcalls
        })

        if (this.state.chain3.isConnected()) {
            console.log("RPC is connected!");

            this.listenForEvents();

            var contractCode = this.state.chain3.mc.getCode(tokenaddress);

            if (contractCode === '0x') {
                console.log("Contract address has no data!");
                return;
            }

            // console.log("owners:", tcalls.owner());
            var starsCount = tcalls.starsCount();
            // console.log('starsCount: ' + starsCount);

            var stars = new Array();
            for (var i = 1; i <= starsCount; i++) {
                var starName = tcalls.voteMapping(i)[1];
                var starCountry = tcalls.voteMapping(i)[2];
                var starVote = tcalls.voteMapping(i)[3];
                console.log('starName:' + starName + 'starCountry: ' + starCountry + 'starVote: ' + starVote);

                document.querySelectorAll(".starCountry").forEach( function(e, index) {
                  if (index+1 == i) {
                    e.innerHTML = starCountry;
                  }
                });

                document.querySelectorAll(".starName").forEach( function(e, index) {
                  if (index+1 == i) {
                    e.innerHTML = starName;
                  }
                });

                document.querySelectorAll(".voteBtn").forEach( function(e, index) {
                  if (index+1 == i) {
                    e.innerHTML = starVote;
                  }
                });

                var star = tcalls.voteMapping(i);
                stars.push(star);
            }

            this.VotedUI();

            this.setState({
              stars,
            })

            console.log("stars: " + this.state.stars);




        } else {
            console.log("RPC not connected!");
        }

    }

    listenForEvents() {
        this.state.chain3.mc.getBlockNumber((err, number) => {
                if (err === null) {
                    console.log("blockNumber:" + number);
                    const myEvent = this.state.contract.votedEvent({}, {
                        fromBlock: number,
                        toBlock: "lastest",
                    }).watch((err, event)=>{
                        var hasVoted = this.state.contract.voters(this.state.account);
                        if (hasVoted) {
                            this.VotedUI();
                            alert("恭喜您，投票成功！！")
                        }
                        console.log("event emit!")
                    });

                    console.log(myEvent);
                }
            });
    }

    //监控panels点击
    ListenPanels() {
        const panels = document.querySelectorAll('.panel');

        function toggleOpen() {
            // console.log('Hello');
            this.classList.toggle('open');
        }

        function toggleActive(e) {
            // console.log(e.propertyName);
            if (e.propertyName.includes('flex')) {
                this.classList.toggle('open-active');
            }
        }
        // 点击时，触发toggleOpen 方法
        panels.forEach(panel => panel.addEventListener('click', toggleOpen));
        // transition结束时，触发toggleActive方法
        panels.forEach(panel => panel.addEventListener('transitionend', toggleActive));
    }



    VotedUI() {
      var hasVoted = this.state.contract.voters(this.state.account);
      if (!hasVoted) {
        document.querySelectorAll(".voteBtn").forEach( function(e, index) {
                  e.innerHTML = "投票";
                });
      }
      else {

        document.querySelectorAll(".voteBtn").forEach( function(e, index) {
                  e.disabled = "disabled";
                });
        this.state.myEvent.stopWatching(()=>console.log("stop watching!!"));
      }
    }

    castVote(e) {

        //球星的star ID
        console.log("球星的star ID: " +e)
        var candidateId = e;

        //network ID
        var networkid = this.state.chain3.version.network;

        //合约调用数据
        var tcalldata = this.state.contract.vote.getData(candidateId,{from: this.state.account});

        //gas估算
        let gasEstimate = this.state.chain3.mc.estimateGas({data: tcalldata});

        this.callContractMethod(this.state.account, this.state.tokenaddress, gasEstimate, networkid, tcalldata);
    }



    callContractMethod(src, contractAddress, gasValue, inchainID, inByteCode){

        console.log("\ncoinbase " + src);
        console.log("\n合约地址 " + contractAddress);
        console.log("\ngas估算 " +gasValue);
        console.log("\nOn network:", inchainID);
        console.log("\nTcalldata:", inByteCode);


        var txcount = this.state.chain3.mc.getTransactionCount(src);
        console.log("Get tx account", txcount)
      //   //Build the raw tx obj
      //   //note the transaction
        var rawTx = {
          from: src,
          to: contractAddress,
          nonce: this.state.chain3.intToHex(txcount),
          gasPrice: this.state.chain3.intToHex(40000000000),
          gasLimit: this.state.chain3.intToHex(gasValue),
          value: this.state.chain3.intToHex('0x0'),
          data: inByteCode,
          chainId: this.state.chain3.intToHex(inchainID)
        }

        console.log(rawTx);

        //moac:0x8Fd1f44ca2f20c934D2b483083a38b3eBE2f3bBc?amount=123.6600&token=MOAC

      // var cmd1 = this.state.chain3.signTransaction(rawTx, "你的私钥");

      // console.log("\nSend signed TX:\n", cmd1);

    //   this.state.chain3.mc.sendRawTransaction(cmd1, function(err, hash) {
    //         if (!err){
    //             console.log("Succeed!: ", hash);
    //             return hash;
    //         }else{
    //             console.log("Chain3 error:", err.message);
    //             // response.success = false;
    //             // response.error = err.message;
    //             return err.message;
    //         }

    //     console.log("Get response from MOAC node in the feedback function!")
    //         // res.send(response);
    //     });


        //sendTransaction 不需要填写秘钥
        this.state.chain3.mc.sendTransaction(rawTx, (err, hash) => {
            if (!err){
                console.log("Succeed!: ", hash);
                return hash;
            }else{
                console.log("Chain3 error:", err.message);
                if (err.message == "authentication needed: password or unlock") {
                    alert("无法投票：请输入密码或解锁unlock你的钱包（控制器执行）")
                }
                else {
                    alert(err.message);
                }

                return err.message;
            }
        })

    }



    render() {
        var address = "moac地址：" + this.state.account;
        return (
          <div id="container">
            <div className="addressDiv">
              <h2>世界杯你最喜爱球星投票</h2>
            </div>
            <div className="panels">
              <div className="panel panel1">
                <p className="starCountry"></p>
                <p className="starName"></p>
                <button id="btn1" className='voteBtn' onClick={()=>{this.castVote(1)}}></button>
              </div>
              <div className="panel panel2">
                <p className="starCountry"></p>
                <p className="starName"></p>
                <button id="btn2" className='voteBtn' onClick={()=>{this.castVote(2)}}></button>
              </div>
              <div className="panel panel3">
                <p className="starCountry"></p>
                <p className="starName"></p>
                <button id="btn3" className='voteBtn' onClick={()=>{this.castVote(3)}}></button>
              </div>
              <div className="panel panel4">
                <p className="starCountry"></p>
                <p className="starName"></p>
                <button id="btn4" className='voteBtn' onClick={()=>{this.castVote(4)}}></button>
              </div>
              <div className="panel panel5">
                <p className="starCountry"></p>
                <p className="starName"></p>
                <button id="btn5"  className='voteBtn' onClick={()=>{this.castVote(5)}}></button>
              </div>
            </div>
            <div className="addressDiv">
              <h3 id="accountAddress" className="addressP">{address}</h3>
            </div>
          </div>
        );
    }
}

export default App
