import React, { useState, useRef, useEffect } from 'react';
import { makeStyles, useTheme } from '@mui/styles';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import ArticleIcon from '@mui/icons-material/Article';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FilterListIcon from '@mui/icons-material/FilterList';
import SyncIcon from '@mui/icons-material/Sync';
import SummarizeIcon from '@mui/icons-material/Summarize';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import Button from '@mui/material/Button';
import { useForm } from '../../components/hooks';
import Formsy from 'formsy-react';
import { TextFieldFormsy, RadioGroupFormsy } from '../../components/formsy';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StarIcon from '@mui/icons-material/Star';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    // margin: '20px'
    minHeight: '100%'
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(0)
  }
}));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const NewReport = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const initialFields = {
    report_name: '',
    entity_type: '',
    fields: [],
    filters: []
  };
  const { form, handleChange, setForm } = useForm(initialFields);
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);
  const theme = useTheme();
  const loading1 = useSelector(({ loading }) => loading.loading1);
  const [search, setSearch] = useState('');
  const [fieldsList, setFieldsList] = useState([]);
  const [allFieldsList, setAllFieldsList] = useState([]);
  const [checked, setChecked] = useState([]);

  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? theme.palette.primary.main : 'lightgrey', //theme.palette.action.hover
    color: isDragging ? theme.palette.primary.contrastText : '',
    fontWeight: 'bold',

    // styles we need to apply on draggables
    ...draggableStyle
  });

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? theme.palette.secondary.light : '',
    padding: grid
  });

  useEffect(() => {
    setFieldsList([
      { id: 1, name: 'Nagi', data_type: 'string', description: 'Nothing' },
      { id: 2, name: 'Reddy', data_type: 'string', description: 'Nothing' },
      { id: 3, name: 'Nagi Reddy', data_type: 'string', description: 'Nothing' }
    ]);
    setAllFieldsList([
      { id: 1, name: 'Nagi', data_type: 'string', description: 'Nothing' },
      { id: 2, name: 'Reddy', data_type: 'string', description: 'Nothing' },
      { id: 3, name: 'Nagi Reddy', data_type: 'string', description: 'Nothing' }
    ]);
  }, []);

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
      }
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
      }
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
      borderRadius: 1
    }
  }));

  const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
    }),
    ...(ownerState.completed && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)'
    })
  }));

  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
      1: <ArticleIcon />,
      2: <TextFieldsIcon />,
      3: <FilterListIcon />,
      4: <SyncIcon />,
      5: <SummarizeIcon />
    };
    const { icon } = props;
    return (
      <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
        {icons[String(icon)]}
      </ColorlibStepIconRoot>
    );
  }

  ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node
  };

  const steps = [
    'Create Report',
    'Select Fields',
    'Filters & Parameters',
    'Properties',
    'Report Summary'
  ];

  const disableButton = () => {
    setIsFormValid(false);
  };

  const enableButton = () => {
    setIsFormValid(true);
  };

  const isSelected = (name) => form.fields.indexOf(name) !== -1;

  const handleClick = (event, name) => {
    const selectedIndex = form.fields.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(form.fields, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(form.fields.slice(1));
    } else if (selectedIndex === form.fields.length - 1) {
      newSelected = newSelected.concat(form.fields.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        form.fields.slice(0, selectedIndex),
        form.fields.slice(selectedIndex + 1)
      );
    }

    setForm({ ...form, fields: newSelected });
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = fieldsList.map((n) => n.name);
      setForm({ ...form, fields: newSelecteds });
      return;
    }
    setForm({ ...form, fields: [] });
  };

  const handleSearch = (data) => {
    setSearch(data);
    if (data === '' || data.length > 1) {
      const target = allFieldsList.filter((item) =>
        item.name.toLowerCase().includes(data.toLowerCase())
      );
      setFieldsList(target);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    console.log(form);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    setForm({ ...form, filters: newChecked });
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(form.fields, result.source.index, result.destination.index);

    setForm({ ...form, fields: items });
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Box
        sx={{
          width: '100%',
          height: 135,
          backgroundColor: 'primary.dark'
        }}>
        <Grid container direction="row" sx={{ p: 3, ml: 2 }}>
          <Grid item>
            <Typography color="primary.contrastText" variant="h4" fontWeight={'bold'}>
              Create new report
            </Typography>
            <Typography sx={{ mt: 1, mr: 1 }} color="primary.contrastText">
              Select one of the queries below to request your report.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Grid container direction="row" sx={{ pt: 3, mt: 3 }}>
        <Stack sx={{ width: '100%' }} spacing={4}>
          <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ p: 4 }}>
            <Formsy
              onValidSubmit={handleNext}
              onValid={enableButton}
              onInvalid={disableButton}
              ref={formRef}
              name="registerForm"
              className={classes.form}>
              {activeStep === 0 && (
                <Box
                  sx={{
                    '& .MuiTextField-root': {
                      mb: 1,
                      mt: 1
                    },
                    '& .react-tel-input.focused': { borderColor: theme.palette.primary.main },
                    pl: 4,
                    pr: 4,
                    pb: 2
                  }}>
                  <Grid
                    container
                    direction="row"
                    sx={{ mb: 2 }}
                    justifyContent="center"
                    alignItems="center">
                    <Grid sx={{ width: '60%' }} item>
                      <TextFieldFormsy
                        label="Report Name"
                        id="report_name"
                        name="report_name"
                        value={form.report_name}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        fullWidth
                        // focused
                        InputLabelProps={{
                          shrink: true
                        }}
                        // size="small"
                      />
                    </Grid>
                  </Grid>
                  <RadioGroupFormsy
                    row
                    className={classes.radio}
                    margin="normal"
                    label="Entity Type"
                    type="radio"
                    id="entity_type"
                    name="entity_type"
                    value={form.entity_type}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    fullWidth
                    InputLabelProps={{
                      shrink: true
                    }}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="baseline">
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel
                          value={'Server Info'}
                          control={<Radio />}
                          label="Server Info"
                        />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel
                          value={'Accounts'}
                          control={<Radio />}
                          label="Accounts Info"
                        />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel
                          value={'Blockchain'}
                          control={<Radio />}
                          label="Blockchain"
                        />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel value={'Checks'} control={<Radio />} label="Checks" />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel
                          value={'Core Server'}
                          control={<Radio />}
                          label="Core Server"
                        />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel
                          value={'Cross-Currency'}
                          control={<Radio />}
                          label="Cross-Currency"
                        />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel
                          value={'Data Retention'}
                          control={<Radio />}
                          label="Data Retention"
                        />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel
                          value={'Decentralized Exchange'}
                          control={<Radio />}
                          label="Decentralized Exchange"
                        />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel
                          value={'Development'}
                          control={<Radio />}
                          label="Development"
                        />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel value={'Escrow'} control={<Radio />} label="Escrow" />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel value={'Fees'} control={<Radio />} label="Fees" />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel
                          value={'Non-fungible Tokens, NFTs'}
                          control={<Radio />}
                          label="Non-fungible Tokens, NFTs"
                        />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel
                          value={'Payment Channels'}
                          control={<Radio />}
                          label="Payment Channels"
                        />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel value={'Payments'} control={<Radio />} label="Payments" />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel
                          value={'Smart Contracts'}
                          control={<Radio />}
                          label="Smart Contracts"
                        />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel value={'Security'} control={<Radio />} label="Security" />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel value={'Tokens'} control={<Radio />} label="Tokens" />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel
                          value={'Transaction Sending'}
                          control={<Radio />}
                          label="Transaction Sending"
                        />
                      </Grid>
                      <Grid xs={12} sm={6} md={2} item>
                        <FormControlLabel value={'XRP'} control={<Radio />} label="XRP" />
                      </Grid>
                    </Grid>
                  </RadioGroupFormsy>
                </Box>
              )}

              {activeStep === 1 && (
                <Box
                  sx={{
                    '& .MuiTextField-root': {
                      mb: 1,
                      mt: 1
                    },
                    pl: 4,
                    pr: 4,
                    pb: 2
                  }}>
                  <Grid
                    container
                    direction="row"
                    sx={{ mb: 2 }}
                    justifyContent="center"
                    alignItems="center">
                    <Grid sx={{ width: '60%' }} item>
                      <TextFieldFormsy
                        id="search"
                        name="search"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        variant="outlined"
                        placeholder="Search..."
                        fullWidth
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </Grid>
                  </Grid>
                  <TableContainer>
                    <Table sx={{ minWidth: 750 }} size="small" aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Checkbox
                              color="primary"
                              indeterminate={
                                form.fields.length > 0 && form.fields.length < fieldsList.length
                              }
                              checked={
                                fieldsList.length > 0 && form.fields.length === fieldsList.length
                              }
                              onChange={handleSelectAllClick}
                              inputProps={{
                                'aria-label': 'select all'
                              }}
                            />
                          </TableCell>
                          <TableCell>Field Name</TableCell>
                          <TableCell align="right">Data Type (length)</TableCell>
                          <TableCell align="right">Description</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fieldsList.map((res, i) => {
                          const isItemSelected = isSelected(res.name);
                          const labelId = `enhanced-table-checkbox-${i}`;

                          return (
                            <TableRow
                              key={res.id + i}
                              onClick={(event) => handleClick(event, res.name)}
                              role="checkbox"
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              selected={isItemSelected}
                              sx={{
                                '&:last-child td, &:last-child th': { border: 0 },
                                '&:nth-of-type(odd)': {
                                  backgroundColor:
                                    form.fields.length === 0 ? theme.palette.action.hover : ''
                                }
                              }}>
                              <TableCell>
                                <Checkbox
                                  color="primary"
                                  checked={isItemSelected}
                                  inputProps={{
                                    'aria-labelledby': labelId
                                  }}
                                />
                              </TableCell>
                              <TableCell>{res.name}</TableCell>
                              <TableCell align="right">{res.data_type}</TableCell>
                              <TableCell align="right">{res.description}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {activeStep === 2 && (
                <Box
                  sx={{
                    pl: 4,
                    pr: 4,
                    pb: 2
                  }}>
                  <Grid
                    container
                    direction="row"
                    sx={{ mb: 2 }}
                    justifyContent="space-evenly"
                    alignItems="baseline">
                    <Grid item>
                      <Typography sx={{ borderBottom: 1 }} variant="h6">
                        Selected Fileds
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography sx={{ borderBottom: 1 }} variant="h6">
                        Filters & Parameters
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-evenly"
                    spacing={2}
                    sx={{ mb: 2 }}
                    alignItems="baseline">
                    <Grid xs={12} md={6} item>
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                          {(provided, snapshot) => (
                            <List
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              style={getListStyle(snapshot.isDraggingOver)}
                              sx={{ width: '100%', maxWidth: 360 }}
                              dense>
                              {form.fields.map((value, i) => {
                                const labelId = `checkbox-list-label-${value}`;

                                return (
                                  <Draggable key={value} draggableId={value} index={i}>
                                    {(provided, snapshot) => (
                                      <ListItem key={value} disablePadding>
                                        <ListItemButton
                                          role={undefined}
                                          onClick={handleToggle(value)}
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                          )}
                                          dense>
                                          <ListItemIcon>
                                            <Checkbox
                                              edge="start"
                                              checked={checked.indexOf(value) !== -1}
                                              tabIndex={-1}
                                              disableRipple
                                              inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                          </ListItemIcon>
                                          <ListItemText id={labelId} primary={`${value}`} />
                                        </ListItemButton>
                                      </ListItem>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </List>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </Grid>
                    <Grid xs={12} md={6} item>
                      <List sx={{ width: '100%', maxWidth: 360 }} dense>
                        {form.filters.map((value) => {
                          return (
                            <ListItem key={value}>
                              <ListItemButton role={undefined} dense>
                                <ListItemIcon>
                                  <StarIcon fontSize="small" color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={value} />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  variant="contained"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  style={{ textTransform: 'capitalize', fontSize: '16px' }}
                  sx={{ mt: 1, mb: 1, px: 6 }}>
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />

                <Button
                  sx={{ mt: 1, mb: 1, px: 6 }}
                  type="submit"
                  // fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={
                    !isFormValid ||
                    (activeStep === 1 && form.fields.length === 0) ||
                    (activeStep === 2 && form.filters.length === 0) ||
                    loading1
                  }
                  aria-label="Register"
                  style={{ textTransform: 'capitalize', fontSize: '16px' }}>
                  {loading1 ? (
                    <CircularProgress size={24} olor="inherit" />
                  ) : activeStep === steps.length - 1 ? (
                    'Finish'
                  ) : (
                    'Next'
                  )}
                </Button>
              </Box>
            </Formsy>
          </Box>
        </Stack>
      </Grid>
    </div>
  );
};

export default NewReport;
