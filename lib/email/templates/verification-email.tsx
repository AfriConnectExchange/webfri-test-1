import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface VerificationEmailProps {
  username: string
  verificationUrl: string
}

export const VerificationEmail = ({
  username,
  verificationUrl,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address for AfriConnect Exchange</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://africonnect.com/logo.png"
          width="150"
          height="37"
          alt="AfriConnect"
          style={logo}
        />
        <Heading style={heading}>Verify your email address</Heading>
        <Text style={paragraph}>Hi {username},</Text>
        <Text style={paragraph}>
          Thanks for signing up for AfriConnect Exchange. To complete your registration,
          please verify your email address by clicking the button below:
        </Text>
        <Section style={buttonContainer}>
          <Button pX={20} pY={12} style={button} href={verificationUrl}>
            Verify Email Address
          </Button>
        </Section>
        <Text style={paragraph}>
          This link will expire in 24 hours. If you did not create an account,
          you can safely ignore this email.
        </Text>
        <Text style={paragraph}>
          If the button above does not work, you can also copy and paste this URL
          into your browser:
        </Text>
        <Text style={url}>{verificationUrl}</Text>
        <Text style={footer}>
          Best regards,
          <br />
          The AfriConnect Exchange Team
        </Text>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const logo = {
  margin: '0 auto',
  marginBottom: '24px',
}

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
}

const paragraph = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149',
}

const buttonContainer = {
  padding: '27px 0 27px',
}

const button = {
  backgroundColor: '#5e6ad2',
  borderRadius: '3px',
  fontWeight: '600',
  color: '#fff',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
}

const url = {
  margin: '0 0 15px',
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#3c4149',
  wordBreak: 'break-all' as const,
}

const footer = {
  fontSize: '13px',
  lineHeight: '1.4',
  color: '#9ca299',
  marginTop: '20px',
  borderTop: '1px solid #e9ebeb',
  paddingTop: '20px',
}
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface VerificationEmailProps {
  username: string
  verificationUrl: string
}

export const VerificationEmail = ({
  username,
  verificationUrl,
}: VerificationEmailProps) => (
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for AfriConnect Exchange</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Heading style={h1}>AfriConnect Exchange</Heading>
          </Section>
          
          <Heading style={h2}>Verify your email address</Heading>
          
          <Text style={text}>Hi {username},</Text>
          
          <Text style={text}>
            Thank you for signing up for AfriConnect Exchange! To complete your registration
            and start exploring our marketplace, please verify your email address by clicking
            the button below.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={verificationUrl}>
              Verify Email Address
            </Button>
          </Section>

          <Text style={text}>
            Or copy and paste this link into your browser:
          </Text>
          
          <Link href={verificationUrl} style={link}>
            {verificationUrl}
          </Link>

          <Text style={text}>
            This verification link will expire in <strong>24 hours</strong>.
          </Text>

          <Text style={footer}>
            If you didn't create an account with AfriConnect Exchange, you can safely ignore
            this email.
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

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 20px',
}