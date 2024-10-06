import React, { useState, useRef } from "react"

import {
    Drawer,
    DrawerBody,
    Text,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    useDisclosure,
    Input,
    Flex,
    Spinner,
} from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormHelperText,
} from '@chakra-ui/react'

import {
    CreatableSelect,
} from "chakra-react-select";

import { createPrescription, createMedicines } from "@/lib/prescription"
import MedicationTable from "./MedicationTable";

export default function AddPrescription() {
    const [medicines, setMedicines] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()

    const onSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        const formData = new FormData(e.target)

        let values = Object.fromEntries(formData.entries())
        values.start_date = new Date(values.start_date)
        values.end_date = new Date(values.end_date)
        values.symptoms = formData.getAll("symptoms")

        const res = await createPrescription(values)

        const prescription_id = res.prescription_id
        await createMedicines(medicines, prescription_id)

        setIsSubmitting(false)
        onClose()
    }

    return (
        <>
            <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
                Add Prescription
            </Button>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent minWidth={800}>
                    <DrawerCloseButton />
                    <DrawerHeader fontSize={"4xl"}>Add prescription</DrawerHeader>
                    <DrawerBody>
                        <form onSubmit={onSubmit}>
                            <Flex direction={"column"} gap={4}>
                                <FormControl>
                                    <FormLabel>Prescription Name</FormLabel>
                                    <Input placeholder="Eg. Cough Medicine" name="name" type='text' />
                                    <FormHelperText>Give a name to your prescriptions for easier access.</FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Prescribed By</FormLabel>
                                    <Input name="prescribed_by" placeholder="Eg. Dr. XYZ" type='text' />
                                    <FormHelperText>Mention the doctor who prescribed the medicine.</FormHelperText>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Symptoms</FormLabel>
                                    <CreatableSelect name="symptoms" useBasicStyles colorScheme="teal" tagVariant="solid" isMulti />
                                    <FormHelperText>Enter your symptoms. Press enter to add more.</FormHelperText>
                                </FormControl>
                                <Flex gap={8}>
                                    <FormControl>
                                        <FormLabel>Start Date</FormLabel>
                                        <Input name="start_date" type='date' />
                                        <FormHelperText>When do you start taking the medicine?</FormHelperText>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>End Date</FormLabel>
                                        <Input name="end_date" type='date' />
                                        <FormHelperText>When does the prescription end?</FormHelperText>
                                    </FormControl>
                                </Flex>
                                <MedicationTable medicines={medicines} setMedicines={setMedicines} />
                                <Flex gap={2} alignItems={"center"} mt={8}>
                                    <Button disabled={isSubmitting} type="submit" colorScheme="teal">
                                        <Flex gap={2} alignItems="center">
                                            {isSubmitting && <Spinner width={4} height={4} />}
                                            <Text>Save Prescription</Text>
                                        </Flex>
                                    </Button>
                                    <Button variant={"ghost"}>Cancel</Button>
                                </Flex>
                            </Flex>
                        </form>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}
