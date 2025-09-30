"use client"

import { useState } from "react"
import { Box, Typography, TextField, Select, MenuItem, Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody, FormControl, InputLabel, CircularProgress, TableFooter, TablePagination } from "@mui/material"
import { Plus, Trash2, Edit, Search, Filter } from "lucide-react"
import { useRequirements } from "../../lib/hooks/useRequirements"
import type { Requirement } from "../../lib/types"
import { PrimaryButton } from "@/lib/utils/styledButton"

export const RequirementsManager = ({ assessmentId }: { assessmentId?: string }) => {
  const { requirements, loading, create, update, remove } = useRequirements(assessmentId)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterFamily, setFilterFamily] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    
  const [formData, setFormData] = useState<Partial<Requirement>>({
    assessmentId: assessmentId || "",
    controlFamily: "Access",
    statement: "",
    mustShould: "MUST",
    testProcedures: [],
    refs: [],
    status: "KNOWN",
  })

  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch = req.statement.toLowerCase().includes(searchTerm.toLowerCase()) || req.controlIdExt?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFamily = filterFamily === "all" || req.controlFamily === filterFamily
    const matchesStatus = filterStatus === "all" || req.status === filterStatus
    return matchesSearch && matchesFamily && matchesStatus
  })

  const handleOpenDialog = (requirement?: Requirement) => {
    if (requirement) {
      setEditingId(requirement.id)
      setFormData(requirement)
    } else {
      setEditingId(null)
      setFormData({
        assessmentId: assessmentId || "",
        controlFamily: "Access",
        statement: "",
        mustShould: "MUST",
        testProcedures: [],
        refs: [],
        status: "KNOWN",
      })
    }
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await update(editingId, formData)
      } else {
        await create(formData as Omit<Requirement, "id" | "tenantId" | "createdAt" | "updatedAt">)
      }
      setDialogOpen(false)
    } catch (error) {
      console.error("Failed to save requirement:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this requirement?")) {
      try {
        await remove(id)
      } catch (error) {
        console.error("Failed to delete requirement:", error)
      }
    }
  }
 const paginatedRequirements = filteredRequirements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search requirements..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search size={18} style={{ marginRight: 8, color: "#666" }} />,
          }}
          sx={{ flex: 1, minWidth: 250 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Control Family</InputLabel>
          <Select value={filterFamily} onChange={(e) => setFilterFamily(e.target.value)} label="Control Family">
            <MenuItem value="all">All Families</MenuItem>
            <MenuItem value="Access">Access</MenuItem>
            <MenuItem value="Data">Data</MenuItem>
            <MenuItem value="Governance">Governance</MenuItem>
            <MenuItem value="IR">IR</MenuItem>
            <MenuItem value="TPRM">TPRM</MenuItem>
            <MenuItem value="BCP">BCP</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Status">
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="KNOWN">Known</MenuItem>
            <MenuItem value="UNCERTAIN">Uncertain</MenuItem>
          </Select>
        </FormControl>
        <PrimaryButton variant="contained" startIcon={<Plus />} onClick={() => handleOpenDialog()} sx={{ height: 40 }}>
          Add Requirement
        </PrimaryButton>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Control ID</TableCell>
              <TableCell>Family</TableCell>
              <TableCell>Statement</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRequirements.map((req) => (
              <TableRow key={req.id}>
                <TableCell style={{maxWidth: 400,wordBreak:'break-all'}}>{req.controlIdExt || "N/A"}</TableCell>
                <TableCell>
                  <Chip label={req.controlFamily} size="small" />
                </TableCell>
                <TableCell sx={{ maxWidth: 400,wordBreak:'break-all' }}>{req.statement}</TableCell>
                <TableCell>
                  <Chip label={req.mustShould} size="small" color={req.mustShould === "MUST" ? "error" : "warning"} />
                </TableCell>
                <TableCell>
                  <Chip label={req.status} size="small" color={req.status === "KNOWN" ? "success" : "warning"} />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenDialog(req)}>
                    <Edit size={16} />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(req.id)}>
                    <Trash2 size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredRequirements.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No requirements found
                </TableCell>
              </TableRow>
            )}
            
          </TableBody>
           <TableFooter >
                        <TableRow >
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            count={filteredRequirements.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </TableRow>
                      </TableFooter>
        </Table>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? "Edit Requirement" : "Add Requirement"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField label="Control ID (External)" inputProps={{maxLength: 100}} value={formData.controlIdExt || ""} onChange={(e) => setFormData({ ...formData, controlIdExt: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>Control Family</InputLabel>
              <Select value={formData.controlFamily} onChange={(e) => setFormData({ ...formData, controlFamily: e.target.value as Requirement["controlFamily"] })} label="Control Family">
                <MenuItem value="Access">Access</MenuItem>
                <MenuItem value="Data">Data</MenuItem>
                <MenuItem value="Governance">Governance</MenuItem>
                <MenuItem value="IR">IR</MenuItem>
                <MenuItem value="TPRM">TPRM</MenuItem>
                <MenuItem value="BCP">BCP</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Statement" inputProps={{maxLength: 500}} multiline rows={3} value={formData.statement} onChange={(e) => setFormData({ ...formData, statement: e.target.value })} required />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={formData.mustShould} onChange={(e) => setFormData({ ...formData, mustShould: e.target.value as "MUST" | "SHOULD" })} label="Type">
                <MenuItem value="MUST">MUST</MenuItem>
                <MenuItem value="SHOULD">SHOULD</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as "KNOWN" | "UNCERTAIN" })} label="Status">
                <MenuItem value="KNOWN">Known</MenuItem>
                <MenuItem value="UNCERTAIN">Uncertain</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <PrimaryButton variant="contained" onClick={handleSubmit}>
            {editingId ? "Update" : "Create"}
          </PrimaryButton>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          
        </DialogActions>
      </Dialog>
    </Box>
  )
}