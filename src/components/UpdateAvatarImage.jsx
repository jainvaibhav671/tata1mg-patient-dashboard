import React, { useRef, useState } from "react"
import { Box, Image } from "@chakra-ui/react"

export default function UpdateAvatarImage({ imgUrl, setUser }) {

    const inputRef = useRef(null)
    const [img, setImg] = useState(imgUrl || "https://via.placeholder.com/150")

    const handleClick = () => inputRef.current?.click()
    const handleFile = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => setImg(reader.result)
    }

    console.log(imgUrl)

    return (
        <Box mb={8} mt={-8}>
            <Image width={150} height={150} onClick={handleClick} rounded="full" cursor="pointer" src={img} alt="avatar" />
            <input accept="image/png,image/jpeg,image/jpg" name="avatar_img" onChange={handleFile} type="file" ref={inputRef} hidden />
        </Box>
    )
}
