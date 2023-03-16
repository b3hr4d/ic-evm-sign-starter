"use client"
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react"

export default function Home() {
  return (
    <Container>
      <Stack spacing="4">
        {["sm", "md", "lg"].map((size) => (
          <Card key={size} size={size}>
            <CardHeader>
              <Heading size="md"> {size}</Heading>
            </CardHeader>
            <CardBody>
              <Text>size = {size}</Text>
            </CardBody>
          </Card>
        ))}
      </Stack>
    </Container>
  )
}
