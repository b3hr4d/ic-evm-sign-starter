import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react"
import { ethers } from "ethers"
import { useState } from "react"

const SendFundsModal = ({
  provider,
  network,
  setTransactions,
  setBalance,
  setCycles,
  setWaiting,
  actor,
  address,
  onClose,
  isOpen,
}) => {
  const [amount, setAmount] = useState("")
  const [destination, setDestination] = useState("")
  const toast = useToast()

  const handleSignTx = async (e) => {
    e.preventDefault()

    onClose()

    setWaiting(true)

    const nonce = await provider.getTransactionCount(address)
    const gasPrice = await provider.getGasPrice().then((s) => s.toHexString())
    const value = ethers.utils.parseEther(amount).toHexString()

    const ABI = ["function stake(address referrer, bool isMonthly) external"]

    const iface = new ethers.utils.Interface(ABI)

    const data = iface.encodeFunctionData("stake", [destination, false])

    const gasLimit = await provider
      .estimateGas({
        to: "0x099774495244f46B9735592b9c679Bd5A052272a",
        value,
        data,
      })
      .then((result) => {
        return result.toHexString()
      })
      .catch((err) => {
        throw err
      })

    const transaction = {
      to: "0x099774495244f46B9735592b9c679Bd5A052272a",
      value,
      data,
      gasLimit,
      gasPrice,
      nonce,
    }

    // sign the contract transaction
    const serializeTx = Buffer.from(
      ethers.utils.serializeTransaction(transaction).slice(2) + "808080",
      "hex"
    )

    toast({ title: "Signing transaction...", variant: "subtle" })

    const res = await actor.sign_evm_tx(
      0,
      [...serializeTx],
      Number(network.chainId)
    )
    if (res.Err) {
      const message = res.Err ?? ""
      toast({
        title: "Error",
        description: message,
        status: "error",
        variant: "subtle",
      })
      return
    }
    const signedTx = Buffer.from(res.Ok.sign_tx, "hex")

    toast({ title: "Sending transaction...", variant: "subtle" })

    const { hash } = await provider.sendTransaction(
      "0x" + signedTx.toString("hex")
    )

    await provider.waitForTransaction(hash)
    toast({ title: `Transfered ${amount} ${network.nativeCurrency.symbol}` })

    setWaiting(false)

    const balance = await provider.getBalance(address)
    setBalance(ethers.utils.formatEther(balance))

    setTransactions((txs) => [
      ...txs,
      { data: signedTx, timestamp: new Date() },
    ])
    setCycles((e) => e - res.Ok.sign_cycles)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Stake</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex>
            <Input
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Destination (Address)"
            />
            <Input
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              type="number"
              ml="10px"
              width="120px"
            />
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSignTx} disabled={!amount || amount === "0"}>
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SendFundsModal
