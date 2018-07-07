pragma solidity ^0.4.17;

contract Vote {
  address public owner;

  struct FootballStar {
        uint id;
        string name;
        string country;
        uint voteCount;
  }

  uint public starsCount;

  //已投票的地址Mapping
  mapping(address => bool) public voters;

  //投票存储Mapping
  mapping (uint => FootballStar) public voteMapping;

  event votedEvent (
    uint _candidateId
  );

  constructor () public {
    owner = msg.sender;
    initStars();
  }

  function initStars ()  private {
    addStar('C-罗纳尔多', '葡萄牙');
    addStar('卢卡库', '比利时');
    addStar('切里舍夫', '俄罗斯');
    addStar('迭戈-科斯塔', '西班牙');
    addStar('凯恩', '英格兰');
  }

  //添加球星到voteMapping
  function addStar (string _starName, string _country)  private {
    starsCount++;
    voteMapping[starsCount] = FootballStar(starsCount, _starName, _country, 0);
  }

  //投票
  function vote (uint _starID) public payable {

    require(!voters[msg.sender]);
    require(_starID > 0 && _starID <= starsCount);

    voters[msg.sender] = true;

    voteMapping[_starID].voteCount ++;

    emit votedEvent(_starID);


  }
}