import React, { useState, useEffect } from "react"
import {
    FormControl,
    FormLabel
} from '@chakra-ui/react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Textarea,
} from '@chakra-ui/react'
import {
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'

import { Button, Input, Text, Heading, Flex } from "@chakra-ui/react"
import { getMedicines } from "../../../lib/prescription"

export default function MedicationTable({ id, medicines, setMedicines }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [data, setData] = useState({})

    useEffect(() => {
        if (typeof id === "undefined") return

        getMedicines(id).then(res => setMedicines(res.data))
    }, [])

    const onInputChange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }

    const addMedicine = (e) => {
        setMedicines([...medicines, { ...data }])
        onClose()
    }

    return (
        <>
            <Flex direction={"column"} gap={4}>
                <Flex justifyContent={"space-between"} gap={4} mt={3}>
                    <Heading size='md'>Medications</Heading>
                    {typeof id === "undefined" && <Button onClick={onOpen} colorScheme="teal" size="sm">Add Medicine</Button>}
                </Flex>
                {medicines.length === 0 && <Text>No Medications Yet!</Text>}
                {medicines.length > 0 && <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Dosage</Th>
                                <Th>Frequency</Th>
                                <Th>Notes</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {medicines.map((medicine) => (
                                <Tr key={medicine.name}>
                                    <Td>{medicine.name}</Td>
                                    <Td>{medicine.dosage}</Td>
                                    <Td>{medicine.frequency}</Td>
                                    <Td>{medicine.notes}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>}
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent py={8} minWidth={900}>
                    <ModalHeader>Add Medicine</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody minWidth={900}>
                        <Flex direction={"column"} gap={2}>
                            <FormControl>
                                <FormLabel>Medicine Name</FormLabel>
                                <Input onChange={onInputChange} name="name" placeholder="Paracetamol" />
                            </FormControl>
                            <Flex gap={2}>
                                <FormControl>
                                    <FormLabel>Dosage</FormLabel>
                                    <Input onChange={onInputChange} name="dosage" placeholder="500gm" />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Frequency</FormLabel>
                                    <Input onChange={onInputChange} name="frequency" placeholder="Thrice daily" />
                                </FormControl>
                            </Flex>
                            <FormControl>
                                <FormLabel>Notes</FormLabel>
                                <Textarea onChange={onInputChange} name="notes" placeholder="Thrice daily" />
                            </FormControl>
                            <Button type="button" onClick={addMedicine} mt={4} colorScheme='teal'>Add</Button>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal >
        </>
    )
}
