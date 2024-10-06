import { Badge, Button, Flex, Heading, useDisclosure } from "@chakra-ui/react"
import React, { useState } from "react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
} from '@chakra-ui/react'
import AddPrescription from "./AddPrescription"
import { Pill } from "lucide-react"
import MedicationTable from "./MedicationTable"
import { useGetPrescriptionsQuery } from "@store/api/prescriptions"

export default function Prescriptions() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [medicines, setMedicines] = useState([])

    const { data: prescriptions } = useGetPrescriptionsQuery()

    return (
        <Flex direction="column" gap={8} width={"100%"}>
            <Flex px={32} py={4} justifyContent={"space-between"}>
                <Heading>Prescriptions</Heading>
                <AddPrescription />
            </Flex>

            <TableContainer px={28}>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>Prescription</Th>
                            <Th>Prescribed By</Th>
                            <Th>Symptoms</Th>
                            <Th>Time Period</Th>
                            <Th>Date</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {typeof prescriptions !== "undefined" && prescriptions.map((prescription) => (
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
                                <Td>{(new Date(prescription.end_date) - new Date(prescription.start_date)) / 1000 / 60 / 60 / 24} days</Td>
                                <Td>{prescription.start_date}</Td>
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
