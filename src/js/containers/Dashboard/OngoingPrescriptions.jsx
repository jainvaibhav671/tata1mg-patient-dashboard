import React, { useState } from "react"
import { Flex, Heading, Badge, Button, useDisclosure } from "@chakra-ui/react"
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { Pill } from "lucide-react"
import { useGetOngoingPrescriptionsQuery } from "@store/api/prescriptions"
import MedicationTable from "../Prescriptions/MedicationTable"

export default function OngoingPrescriptions() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { data: ongoingPrescriptions, error, isLoading } = useGetOngoingPrescriptionsQuery()
    const [medicines, setMedicines] = useState([])

    if (error) {
        console.log(error)
    }

    return (
        <Flex direction={"column"} gap={12}>
            <Heading>Ongoing Prescriptions</Heading>
            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Prescription</Th>
                            <Th>Prescribed By</Th>
                            <Th>Symptoms</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {typeof ongoingPrescriptions !== "undefined" && ongoingPrescriptions.map((prescription) => (
                            <Tr cursor={"pointer"} key={prescription.id}>
                                <Td>{prescription.name}</Td>
                                <Td>{prescription.prescribed_by}</Td>
                                <Td>
                                    {prescription.symptoms.map((symptom) => (
                                        <Badge
                                            rounded={"md"}
                                            px={2}
                                            key={symptom}
                                            variant="subtle"
                                            colorScheme="yellow"
                                            mr={1}
                                        >
                                            {symptom}
                                        </Badge>
                                    ))}
                                </Td>
                                <Td>
                                    <Button onClick={onOpen} rightIcon={<Pill size={16} strokeWidth={3} />} size="sm" colorScheme="teal">
                                        See Medications
                                    </Button>

                                    <Modal isOpen={isOpen} onClose={onClose}>
                                        <ModalOverlay />
                                        <ModalContent pb={12}>
                                            <ModalHeader mb={4}></ModalHeader>
                                            <ModalCloseButton />
                                            <ModalBody>
                                                <MedicationTable medicines={medicines} setMedicines={setMedicines} id={prescription.id} />
                                            </ModalBody>
                                        </ModalContent>
                                    </Modal>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Flex>
    )
}
