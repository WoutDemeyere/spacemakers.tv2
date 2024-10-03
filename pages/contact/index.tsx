import React from "react";
import { useForm } from "@mantine/form";
import {
	TextInput,
	Textarea,
	Button,
	Container,
	Grid,
	Group,
	Title,
	Text,
	Notification,
	Divider,
	Flex,
} from "@mantine/core";
import {
	IconMail,
	IconPhone,
	IconMapPin,
	IconBuilding,
	IconCheck,
	IconX,
} from "@tabler/icons-react";
import { useState } from "react";

import styles from "./contact.module.css";

import {
	FiInstagram,
	FiFacebook,
	FiMail,
	FiMapPin,
	FiPhone,
	FiLinkedin,
	FiCreditCard,
} from "react-icons/fi";
import { GetServerSideProps } from "next";

const ContactPage = () => {
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Using Mantine form hook
	const form = useForm({
		initialValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			company: "",
			message: "",
		},

		validate: {
			firstName: (value) =>
				value.trim().length < 2
					? "First name must have at least 2 characters"
					: null,
			lastName: (value) =>
				value.trim().length < 2
					? "Last name must have at least 2 characters"
					: null,
			email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
			phone: (value) =>
				/^\d+$/.test(value) ? null : "Phone number must contain only digits",
			company: (value) =>
				value.trim().length < 2
					? "Company name must have at least 2 characters"
					: null,
			message: (value) =>
				value.trim().length < 5
					? "Message must have at least 5 characters"
					: null,
		},
	});

	// Simulating form submission to an API
	const handleSubmit = async (values: typeof form.values) => {
		try {
			// Example POST request to your API endpoint
			const response = await fetch("https://example.com/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});

			if (response.ok) {
				setSubmitted(true);
				form.reset(); // Reset form after successful submission
			} else {
				throw new Error("Failed to submit the form");
			}
		} catch (error) {
			setError("Failed to submit. Please try again later.");
		}
	};

	return (
		<Container size="lg" py="xl">
			<Grid gutter="xl">
				{/* Left side with contact info */}
				<Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
					<Title order={1} mb="xl">
						Contact us
					</Title>

					<Flex direction="column" gap={{ base: "md", md: "md", lg: "xl" }}>
						<Text>
							<IconMapPin size={16} /> Moenkouterstraat 3 bus 6, 8550 Zwevegem
						</Text>
						<Text>
							<IconMail size={16} /> info@spacemakers.tv
						</Text>
						<Text>
							<IconPhone size={16} /> +32 478 03 38 44
						</Text>
						<Text>
							<IconBuilding size={16} /> BE 1005.853.079
						</Text>
					</Flex>

					<Group mt="xl">
						<a
							className={styles.contact_form_title_line_icon_href}
							href="https://www.facebook.com/spacemakerstv"
							target="_blank"
							rel="noopener noreferrer">
							<FiFacebook className={styles.contact_form_title_line_icon} />
						</a>
						<a
							className={styles.contact_form_title_line_icon_href}
							href="https://www.instagram.com/spacemakers_/"
							target="_blank"
							rel="noopener noreferrer">
							<FiInstagram className={styles.contact_form_title_line_icon} />
						</a>

						<a
							className={styles.contact_form_title_line_icon_href}
							href="https://www.linkedin.com/company/spacemakerstv"
							target="_blank"
							rel="noopener noreferrer">
							<FiLinkedin className={styles.contact_form_title_line_icon} />
						</a>
					</Group>
				</Grid.Col>
				{/* 
        <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
          <Divider my="xl" size="lg" orientation='vertical' color='black' />
        </Grid.Col> */}

				{/* Right side with form */}
				<Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<Grid gutter="xl">
							<Grid.Col span={6}>
								<TextInput
									label="First name"
									placeholder="First name"
									{...form.getInputProps("firstName")}
									required
								/>
							</Grid.Col>
							<Grid.Col span={6}>
								<TextInput
									label="Last name"
									placeholder="Last name"
									{...form.getInputProps("lastName")}
									required
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<TextInput
									label="Email"
									placeholder="Email"
									{...form.getInputProps("email")}
									required
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<TextInput
									label="Phone Number"
									placeholder="Phone"
									{...form.getInputProps("phone")}
									required
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<TextInput
									label="Company"
									placeholder="Company"
									{...form.getInputProps("company")}
									required
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<Textarea
									label="Message"
									placeholder="Message"
									{...form.getInputProps("message")}
									required
								/>
							</Grid.Col>
							<Grid.Col span={12}>
								<Button type="submit" fullWidth>
									Send
								</Button>
							</Grid.Col>
						</Grid>
					</form>

					{/* Submission feedback */}
					{submitted && (
						<Notification
							icon={<IconCheck size={18} />}
							color="teal"
							title="Form submitted"
							onClose={() => setSubmitted(false)}>
							Thank you for your message! We will get back to you soon.
						</Notification>
					)}

					{error && (
						<Notification
							icon={<IconX size={18} />}
							color="red"
							title="Submission failed"
							onClose={() => setError(null)}>
							{error}
						</Notification>
					)}
				</Grid.Col>
			</Grid>
		</Container>
	);
};

export const getServerSideProps: GetServerSideProps = async () => {
	const title = "Contact";
	const description =
		"Contact us at spacemakers.tv, find us on instagram / linkedin or send us an email.";

	return {
		props: {
			title,
			description,
		},
	};
};

export default ContactPage;
