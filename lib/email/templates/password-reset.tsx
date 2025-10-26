import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface PasswordResetEmailProps {
  userName: string
  resetLink: string
}

export default function PasswordResetEmail({
  userName,
  resetLink,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your AfriConnect Exchange password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Heading style={h1}>AfriConnect Exchange</Heading>
          </Section>
          
          <Heading style={h2}>Reset your password</Heading>
          
          <Text style={text}>Hello {userName},</Text>
          
          <Text style={text}>
            We received a request to reset the password for your AfriConnect Exchange account.
            Click the button below to create a new password.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetLink}>
              Reset Password
            </Button>
          </Section>

          <Text style={text}>
            Or copy and paste this link into your browser:
          </Text>
          
          <Link href={resetLink} style={link}>
            {resetLink}
          </Link>

          <Text style={text}>
            This password reset link will expire in <strong>1 hour</strong>.
          </Text>

          <Section style={warningBox}>
            <Text style={warningText}>
              <strong>⚠️ Security Notice:</strong> If you didn't request a password reset,
              please ignore this email and ensure your account is secure. Your password will
              not be changed unless you click the link above.
            </Text>
          </Section>

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

const link = {
  color: '#E11D48',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
  margin: '16px 20px',
  display: 'block',
}

const warningBox = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 20px',
}

const warningText = {
  color: '#991b1b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 20px',
}