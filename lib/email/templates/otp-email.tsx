import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface OTPEmailProps {
  userName: string
  otp: string
}

export default function OTPEmail({ userName, otp }: OTPEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your AfriConnect Exchange verification code</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Heading style={h1}>AfriConnect Exchange</Heading>
          </Section>
          
          <Heading style={h2}>Your Verification Code</Heading>
          
          <Text style={text}>Hello {userName},</Text>
          
          <Text style={text}>
            We couldn't send your verification code via SMS. Here's your code:
          </Text>

          <Section style={otpContainer}>
            <Text style={otpText}>{otp}</Text>
          </Section>

          <Text style={text}>
            This code expires in <strong>5 minutes</strong>.
          </Text>

          <Text style={text}>
            Enter this code in the verification page to complete your registration.
          </Text>

          <Text style={footer}>
            If you didn't request this code, you can safely ignore this email.
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

const otpContainer = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 20px',
  textAlign: 'center' as const,
}

const otpText = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#E11D48',
  letterSpacing: '8px',
  margin: '0',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 20px',
}