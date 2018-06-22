const ElectrumClient = require('electrum-client')

module.exports = async (network) => {
  const peers = network.electrumx.peers
  if (peers) {
    const getRandomPeer = () => {return peers[(peers.length * Math.random()) | 0];}
    const peer = getRandomPeer()
    console.log(peer.host)
    const ecl = new ElectrumClient(peer.port, peer.host, 'ssl')
    try {
      await ecl.connect()
      await ecl.server_version('2.7.11', '1.2')
      return ecl
    } catch (e) {
      return module.exports(network)
    }
  } else {
    console.log('ElectrumX ' + network + ' peer list: ' + peers)
  }
}
