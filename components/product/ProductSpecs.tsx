import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

export default function ProductSpecs({ specs }: { specs: { key: string; value: string }[] }) {
  if (!specs || specs.length === 0) return null

  return (
    <Card variant="outlined" sx={{ borderRadius: 1 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>Specifications</Typography>
        <Table size="small">
          <TableBody>
            {specs.map((s) => (
              <TableRow key={s.key}>
                <TableCell sx={{ width: 180, fontWeight: 700 }}>{s.key}</TableCell>
                <TableCell>{s.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
