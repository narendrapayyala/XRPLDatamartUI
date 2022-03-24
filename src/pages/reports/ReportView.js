import React, { useEffect, useState, useRef } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { makeStyles, useTheme } from '@mui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import History from '../../configurations/@history';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Icon from '@mui/material/Icon';
import { useForm } from '../../components/hooks';
import Formsy from 'formsy-react';
import { TextFieldFormsy, RadioGroupFormsy } from '../../components/formsy';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  clearReportList,
  generateReport,
  downloadCSVReport
} from '../../store/reports/reportsSlice';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    // margin: '20px'
    minHeight: '100%'
  }
}));

const ReportView = () => {
  const classes = useStyles();
  const routeParams = useParams();
  const dispatch = useDispatch();
  const theme = useTheme();
  const templatesList = useSelector(({ reports }) => reports.templatesList);
  const reportList = useSelector(({ reports }) => reports.reportList);
  const [templateData, setTemplatedata] = useState([]);
  const [fields, setFields] = useState([]);
  const [filters, setFilters] = useState([]);
  const [value, setValue] = useState('1');
  const loading1 = useSelector(({ loading }) => loading.loading1);
  const [initialFields, setInitialFields] = useState({});
  const { form, handleChange } = useForm(initialFields);
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);

  // console.log(fields);
  useEffect(() => {
    dispatch(clearReportList());
    if (templatesList.length != 0) {
      if (routeParams.id) {
        const target = templatesList.find((res) => String(res.uuid) === String(routeParams.id));
        const target1 = JSON.parse(target.filters);
        const target2 = target1.filter((res) => res.name != 'command');
        const iniFields = target2.reduce((obj, item) => ({ ...obj, [item.name]: '' }), {});
        const fieldsTarget = JSON.parse(target.fields);
        setInitialFields(iniFields);
        // console.log(iniFields);
        setFilters(target2);
        setFields(fieldsTarget);
        setTemplatedata(target);
      }
    } else {
      return History.goBack();
    }
  }, [routeParams.id]);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const disableButton = () => {
    setIsFormValid(false);
  };

  const enableButton = () => {
    setIsFormValid(true);
  };

  const handleSubmit = () => {
    const data = {
      id: templateData.id,
      uuid: templateData.uuid,
      params: { command: templateData.entity_type, ...form },
      entity_type: templateData.entity_type
    };
    // console.log(data);
    dispatch(generateReport(data)).then((res) => {
      //   console.log(res);
      if (res.payload && res.payload.length != 0) {
        setValue('2');
      }
    });
  };

  const downloadCSV = () => {
    const data = {
      id: templateData.id,
      uuid: templateData.uuid,
      params: { command: templateData.entity_type, ...form },
      entity_type: templateData.entity_type
    };
    dispatch(downloadCSVReport(data)).then((res) => {
      //   console.log(res);
      if (res.payload) {
        const downloadLink = document.createElement('a');
        const blob = new Blob(['\ufeff', res.payload]);
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = `${templateData.report_name}.csv`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    });
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Box
        sx={{
          width: '100%',
          height: 65,
          backgroundColor: 'primary.dark'
        }}>
        <Grid container direction="row" sx={{ p: 1.5 }}>
          <Grid item>
            <Typography color="primary.contrastText" variant="h5" fontWeight={'bold'}>
              Generate report - {templateData.report_name}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ width: '100%', p: 4 }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
              <Tab label="Request Report" value="1" />
              <Tab label="Data" value="2" disabled={reportList.length === 0} />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Formsy
              onValidSubmit={handleSubmit}
              onValid={enableButton}
              onInvalid={disableButton}
              ref={formRef}
              name="registerForm"
              className={classes.form}>
              <Box
                sx={{
                  '& .MuiTextField-root': {
                    mb: 1,
                    mt: 3,
                    width: '50%',
                    textTransform: 'capitalize'
                  },
                  '& .react-tel-input.focused': { borderColor: theme.palette.primary.main },
                  pl: 0,
                  pr: 4,
                  pb: 1
                }}>
                <Grid container direction="row" sx={{ mb: 1 }}>
                  {filters.map((res, i) =>
                    res.type != 'boolean' ? (
                      <Grid key={i} sx={{ width: '100%' }} item>
                        <TextFieldFormsy
                          label={res.name}
                          id={res.name}
                          name={res.name}
                          type={res.type}
                          value={form[res.name]}
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
                    ) : (
                      <Grid
                        container
                        key={i}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="baseline">
                        <Grid sx={{ width: '100%', mt: 1, textTransform: 'capitalize' }} item>
                          <RadioGroupFormsy
                            row
                            className={classes.radio}
                            margin="normal"
                            label={res.name}
                            id={res.name}
                            name={res.name}
                            type={res.type}
                            value={form[res.name]}
                            onChange={handleChange}
                            variant="outlined"
                            required
                            fullWidth
                            InputLabelProps={{
                              shrink: true
                            }}>
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              label={<Typography noWrap>{'Yes'}</Typography>}
                              sx={{ textTransform: 'capitalize' }}
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label={<Typography noWrap>{'No'}</Typography>}
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </RadioGroupFormsy>
                        </Grid>
                      </Grid>
                    )
                  )}
                </Grid>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  sx={{ mt: 1, mb: 1, px: 6 }}
                  type="submit"
                  // fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={!isFormValid || loading1}
                  aria-label="Register"
                  style={{ textTransform: 'capitalize', fontSize: '16px' }}>
                  {loading1 ? <CircularProgress size={24} olor="inherit" /> : 'Request Report'}
                </Button>
              </Box>
            </Formsy>
          </TabPanel>
          <TabPanel value="2">
            <Paper sx={{ width: '100%', mb: 2 }}>
              {(templateData.property_type === 'File Generation' ||
                templateData.property_type === 'Database Sync') && (
                <Grid
                  container
                  direction="row"
                  sx={{ mb: 2 }}
                  justifyContent={'space-between'}
                  alignItems={'baseline'}>
                  <Grid item></Grid>
                  <Grid item>
                    {templateData.property_type === 'File Generation' &&
                      templateData.file_generation === 'CSV' && (
                        <Button
                          sx={{ mx: 2, color: theme.palette.primary.contrastText, mt: 1 }}
                          variant="contained"
                          color="primary"
                          onClick={() => downloadCSV()}
                          type="button">
                          {loading1 ? (
                            <>
                              <CircularProgress size={20} color="secondary" className="mr-6" />
                              <span>DOWNLOAD CSV</span>
                            </>
                          ) : (
                            'DOWNLOAD CSV'
                          )}
                        </Button>
                      )}
                    {templateData.property_type === 'Database Sync' && (
                      <Button
                        variant="contained"
                        sx={{ mx: 2, color: theme.palette.primary.contrastText, mt: 1 }}
                        startIcon={<Icon>sync</Icon>}
                        color="primary"
                        type="button">
                        Sync
                      </Button>
                    )}
                    {templateData.property_type === 'File Generation' &&
                      templateData.file_generation === 'PDF' && (
                        <Button
                          sx={{ mx: 2, color: theme.palette.primary.contrastText, mt: 1 }}
                          variant="contained"
                          color="primary"
                          type="button">
                          DOWNLOAD PDF
                        </Button>
                      )}
                  </Grid>
                </Grid>
              )}
              <TableContainer>
                {reportList.length != 0 && (
                  <Table sx={{ minWidth: 750 }} size="small" aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        {fields
                          .sort((a, b) => a.order - b.order)
                          .map((row, i) => (
                            <TableCell sx={{ textTransform: 'capitalize' }} key={i + 'header'}>
                              {row.field}
                            </TableCell>
                          ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportList.map((row, i) => (
                        <TableRow
                          key={i}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}>
                          {Object.keys(row).map((key, index) => {
                            //   const type = fields.find((res) => res.field === key).type;
                            //   console.log(type);
                            return <TableCell key={i + index}>{row[key]}</TableCell>;
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TableContainer>
            </Paper>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default ReportView;
