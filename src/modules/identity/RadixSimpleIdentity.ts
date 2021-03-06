import RadixECIES from '../crypto/RadixECIES'
import RadixIdentity from './RadixIdentity'
import RadixAccount from '../account/RadixAccount'

import { RadixAtom, RadixKeyPair } from '../RadixAtomModel'

export default class RadixSimpleIdentity extends RadixIdentity {
    constructor(readonly keyPair: RadixKeyPair) {
        super()

        this.account = new RadixAccount(keyPair)

        this.account.enableDecryption(this)
    }

    public async signAtom(atom: RadixAtom) {
        const signature = this.keyPair.sign(atom.getHash())
        const signatureId = this.keyPair.getUID()

        atom.signatures = { [signatureId.toString()]: signature }

        return atom
    }

    public async decryptECIESPayload(payload: Buffer) {
        return RadixECIES.decrypt(this.keyPair.getPrivate(), payload)
    }

    public getPublicKey() {
        return Buffer.from(this.keyPair.keyPair.getPublic().encode('be', true))
    }
}
