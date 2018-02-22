const ElectrumClient = require('electrum-client')

const peers = require('electrum-host-parse').getDefaultPeers("BitcoinSegwit").filter(v => v.ssl)
const getRandomPeer = () => peers[peers.length * Math.random() | 0]

const x = require('electrum-host-parse').getDefaultCoinNames()
console.log(x)

const main = async () => {
    const peer = getRandomPeer()
    console.log('begin connection: ' + JSON.stringify(peer))
    const ecl = new ElectrumClient(peer.ssl, peer.host, 'ssl')
    await ecl.connect()
    try{
        const balance = await ecl.blockchainAddress_getBalance("12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX")
        console.log(balance)
		const donate = await ecl.serverDonation_address()
		console.log(balance.confirmed);
        const unspent = await ecl.blockchainAddress_listunspent("12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX")
        console.log(unspent)
    }catch(e){
        console.log(e)
    }
    await ecl.close()
}
main().catch(console.log)