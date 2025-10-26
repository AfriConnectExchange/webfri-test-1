import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface WelcomeEmailProps {
  userName: string
  dashboardLink: string
}

export default function WelcomeEmail({
  userName,
  dashboardLink,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to AfriConnect Exchange!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Heading style={h1}>AfriConnect Exchange</Heading>
          </Section>
          
          <Heading style={h2}>Welcome aboard, {userName}! 🎉</Heading>
          
          <Text style={text}>
            Your email has been verified successfully, and your account is now active!
          </Text>
          
          <Text style={text}>
            You're now part of the AfriConnect Exchange community - a marketplace connecting
            buyers, sellers, and service providers across Africa and beyond.
          </Text>

          <Text style={text}>
            <strong>What you can do now:</strong>
          </Text>

          <ul style={list}>
            <li style={listItem}>Browse thousands of products and services</li>
            <li style={listItem}>List your own items for sale</li>
            <li style={listItem}>Connect with trusted sellers and buyers</li>
            <li style={listItem}>Access skill-building courses</li>
            <li style={listItem}>Send secure remittances</li>
          </ul>

          <Section style={buttonContainer}>
            <Button style={button} href={dashboardLink}>
              Go to Dashboard
            </Button>
          </Section>

          <Text style={footer}>
            Need help getting started? Check out our{' '}
            <a href={`${process.env.NEXT_PUBLIC_APP_URL}/help`} style={linkStyle}>
              Help Center
            </a>{' '}
            or contact our support team.
          </Text>

          <Text style={footer}>
            Best regards,
            <br />
            The AfriConnect Exchange Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const logoContainer = {
  padding: '32px 20px',
  textAlign: 'center' as const,
  borderBottom: '1px solid #e5e7eb',
}

const h1 = {
  color: '#E11D48',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0',
  padding: '0',
}

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: '600',
  margin: '30px 20px 20px',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 20px',
}

const list = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 20px',
  paddingLeft: '20px',
}

const listItem = {
  margin: '8px 0',
}

const buttonContainer = {
  padding: '27px 20px',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#E11D48',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 20px',
}

const linkStyle = {
  color: '#E11D48',
  textDecoration: 'underline',
}