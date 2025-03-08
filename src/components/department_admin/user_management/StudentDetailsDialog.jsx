import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

// Department admin colors - passed via props or use default
const defaultColors = {
  light: "#81C784",
  main: "#4CAF50", 
  dark: "#2E7D32",
};

const useStyles = makeStyles({
  dialogTitle: {
    backgroundColor: props => props.colors?.dark || defaultColors.dark,
    color: 'white',
  },
  studentInfoCards: {
    marginBottom: '20px',
  },
  infoCard: {
    height: '100%',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1) !important',
    },
  },
  cardIcon: {
    marginBottom: '8px',
    fontSize: '32px !important',
    color: props => props.colors?.main || defaultColors.main,
  },
  labelValue: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px dashed #eee',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  label: {
    fontWeight: '500 !important',
    color: '#666',
  },
  value: {
    fontWeight: '500 !important',
  },
});

const StudentDetailsDialog = ({ 
  open, 
  handleClose, 
  selectedUser, 
  userDetails, 
  loadingDetails,
  colors = defaultColors 
}) => {
  const classes = useStyles({ colors });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle className={classes.dialogTitle}>
        {selectedUser ? `Student Details: ${selectedUser.username}` : 'Student Details'}
      </DialogTitle>
      <DialogContent dividers>
        {loadingDetails ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress size={60} sx={{ color: colors.main }} />
          </Box>
        ) : !userDetails ? (
          <Alert severity="info">No details available for this student.</Alert>
        ) : (
          <Box>
            {/* Profile Overview Cards */}
            <Grid container spacing={3} className={classes.studentInfoCards}>
              <Grid item xs={12} md={6}>
                <Card className={classes.infoCard} elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <PersonIcon sx={{ verticalAlign: 'middle', mr: 1, color: colors.main }} />
                      Personal Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box className={classes.labelValue}>
                      <Typography className={classes.label}>Name:</Typography>
                      <Typography className={classes.value}>{userDetails.profile.name}</Typography>
                    </Box>
                    <Box className={classes.labelValue}>
                      <Typography className={classes.label}>Email:</Typography>
                      <Typography className={classes.value}>{userDetails.profile.email}</Typography>
                    </Box>
                    <Box className={classes.labelValue}>
                      <Typography className={classes.label}>Department:</Typography>
                      <Typography className={classes.value}>{userDetails.profile.department}</Typography>
                    </Box>
                    {userDetails.profile.rank_in_department && (
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Department Rank:</Typography>
                        <Typography className={classes.value}>{userDetails.profile.rank_in_department}</Typography>
                      </Box>
                    )}
                    {userDetails.profile.preferred_role && (
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Preferred Role:</Typography>
                        <Typography className={classes.value}>
                          {userDetails.profile.preferred_role.replace(/_/g, ' ').split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </Typography>
                      </Box>
                    )}
                    {userDetails.profile.skills && (
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Skills:</Typography>
                        <Typography className={classes.value}>{userDetails.profile.skills}</Typography>
                      </Box>
                    )}
                    {userDetails.profile.profile_completion_date && (
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Profile Completed:</Typography>
                        <Typography className={classes.value}>
                          {new Date(userDetails.profile.profile_completion_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>
                    )}
                    {userDetails.profile.last_update_date && (
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Last Updated:</Typography>
                        <Typography className={classes.value}>
                          {new Date(userDetails.profile.last_update_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card className={classes.infoCard} elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1, color: colors.main }} />
                      Academic Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    {userDetails.profile.student_id && (
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Student ID:</Typography>
                        <Typography className={classes.value}>{userDetails.profile.student_id}</Typography>
                      </Box>
                    )}
                    {userDetails.profile.batch && (
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Batch:</Typography>
                        <Typography className={classes.value}>{userDetails.profile.batch}</Typography>
                      </Box>
                    )}
                    {userDetails.profile.current_cgpa !== undefined && (
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Current CGPA:</Typography>
                        <Typography className={classes.value}>{userDetails.profile.current_cgpa}</Typography>
                      </Box>
                    )}
                    {userDetails.profile.phone && (
                      <Box className={classes.labelValue}>
                        <Typography className={classes.label}>Phone:</Typography>
                        <Typography className={classes.value}>{userDetails.profile.phone}</Typography>
                      </Box>
                    )}
                    {userDetails.academic_statistics && (
                      <>
                        <Box className={classes.labelValue}>
                          <Typography className={classes.label}>Total Assessments:</Typography>
                          <Typography className={classes.value}>{userDetails.academic_statistics.total_assessments}</Typography>
                        </Box>
                        <Box className={classes.labelValue}>
                          <Typography className={classes.label}>Completed Assessments:</Typography>
                          <Typography className={classes.value}>{userDetails.academic_statistics.completed_assessments}</Typography>
                        </Box>
                        <Box className={classes.labelValue}>
                          <Typography className={classes.label}>Average Score:</Typography>
                          <Typography className={classes.value}>{userDetails.academic_statistics.average_score.toFixed(1)}%</Typography>
                        </Box>
                        <Box className={classes.labelValue}>
                          <Typography className={classes.label}>Pass Rate:</Typography>
                          <Typography className={classes.value}>{userDetails.academic_statistics.pass_rate.toFixed(1)}%</Typography>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Assessment Details - Render only if available */}
            {userDetails.assessments && userDetails.assessments.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1, color: colors.main }} />
                  Assessment History
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {userDetails.assessments.map((assessment, index) => (
                  <Paper key={index} elevation={1} sx={{ mb: 2, p: 2, borderRadius: '8px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography sx={{ fontWeight: 'bold', color: colors.dark }}>
                        {assessment.title}
                      </Typography>
                      <Chip 
                        label={assessment.status} 
                        size="small"
                        sx={{ 
                          backgroundColor: assessment.status === 'Passed' ? '#e8f5e9' : '#ffebee',
                          color: assessment.status === 'Passed' ? '#2e7d32' : '#c62828'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {assessment.description}
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box className={classes.labelValue}>
                          <Typography className={classes.label}>Score:</Typography>
                          <Typography className={classes.value}>{assessment.score}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box className={classes.labelValue}>
                          <Typography className={classes.label}>Submitted:</Typography>
                          <Typography className={classes.value}>
                            {new Date(assessment.submitted_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box className={classes.labelValue}>
                          <Typography className={classes.label}>Evaluated:</Typography>
                          <Typography className={classes.value}>
                            {assessment.evaluated_at ? new Date(assessment.evaluated_at).toLocaleDateString() : 'Pending'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Box className={classes.labelValue}>
                          <Typography className={classes.label}>Duration:</Typography>
                          <Typography className={classes.value}>{assessment.duration_minutes} mins</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    {assessment.answers && assessment.answers.length > 0 && (
                      <>
                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                          Question Responses:
                        </Typography>
                        <Box sx={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px', p: 1 }}>
                          {assessment.answers.map((answer, idx) => (
                            <Box key={idx} sx={{ mb: 1, p: 1, backgroundColor: answer.is_correct ? '#f1f8e9' : '#fff8e8', borderRadius: '4px' }}>
                              <Typography variant="body2" fontWeight="500">
                                Question {idx + 1}: {answer.question_text}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                <Typography variant="body2">
                                  Student answer: {answer.student_answer}
                                </Typography>
                                <Typography variant="body2" sx={{ color: answer.is_correct ? '#2e7d32' : '#e65100' }}>
                                  {answer.is_correct ? 
                                    `Correct (+${answer.marks_allocated} marks)` : 
                                    `Incorrect (0/${answer.marks_allocated} marks)`}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </>
                    )}
                  </Paper>
                ))}
              </>
            )}

            {/* Curriculum - Render only if available */}
            {userDetails.curriculum && userDetails.curriculum.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1, color: colors.main }} />
                  Assigned Curriculum
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {userDetails.curriculum.map((curriculum, index) => (
                  <Paper key={index} elevation={1} sx={{ mb: 2, p: 2, borderRadius: '8px' }}>
                    <Typography sx={{ fontWeight: 'bold', color: colors.dark }}>
                      {curriculum.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {curriculum.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2">
                        <strong>Role:</strong> {curriculum.role.replace('_', ' ')}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Created:</strong> {new Date(curriculum.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    
                    {curriculum.content && curriculum.content.modules && (
                      <>
                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                          Curriculum Modules:
                        </Typography>
                        <Box sx={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '4px', p: 1 }}>
                          {curriculum.content.modules.map((module, idx) => (
                            <Box key={idx} sx={{ mb: 2 }}>
                              <Typography variant="body1" fontWeight="500" color={colors.dark}>
                                {module.name}
                              </Typography>
                              <Box component="ul" sx={{ mt: 0.5, mb: 1, pl: 2 }}>
                                {module.topics.map((topic, topicIdx) => (
                                  <Box component="li" key={topicIdx} sx={{ mb: 0.5 }}>
                                    <Typography variant="body2">{topic}</Typography>
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </>
                    )}
                  </Paper>
                ))}
              </>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{ color: '#666' }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentDetailsDialog;