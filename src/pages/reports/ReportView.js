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
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  clearReportList,
  generateReport,
  downloadCSVReport,
  databaseSync,
  getTemplatesList,
  getEntityList
} from '../../store/reports/reportsSlice';
import moment from 'moment';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

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
  const entityList = useSelector(({ reports }) => reports.entityList);
  const reportList = useSelector(({ reports }) => reports.reportList);
  const [templateData, setTemplatedata] = useState([]);
  const [fields, setFields] = useState([]);
  const [filters, setFilters] = useState([]);
  const [value, setValue] = useState('1');
  const loading1 = useSelector(({ loading }) => loading.loading1);
  const loading3 = useSelector(({ loading }) => loading.loading3);
  const [initialFields, setInitialFields] = useState({});
  const { form, handleChange, setForm } = useForm(initialFields);
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    dispatch(getEntityList());
    dispatch(getTemplatesList());
    dispatch(clearReportList());
  }, []);

  useEffect(() => {
    if (templatesList.length != 0 && routeParams.id) {
      if (routeParams.id) {
        const target = templatesList.find((res) => String(res.uuid) === String(routeParams.id));
        if (target) {
          const target1 = JSON.parse(target.filters);
          const target2 = target1.filter((res) => res.name != 'command');
          const iniFields = target2.reduce((obj, item) => ({ ...obj, [item.name]: '' }), {});
          const fieldsTarget = JSON.parse(target.fields);
          // console.log(target);
          if (target.entity_type === 'account_info' || target.entity_type === 'account_nfts') {
            const tmp = { ...iniFields, accounts: [] };
            delete tmp.account;
            const tmp1 = target2.map((res) => {
              if (res.name === 'account') {
                return { ...res, name: 'accounts' };
              }
              return res;
            });
            setInitialFields(tmp);
            setFilters(tmp1);
          } else if (target.entity_type === 'nft_offers') {
            const tmp = { ...iniFields, nfts: [] };
            delete tmp.account;
            const tmp1 = target2.map((res) => {
              if (res.name === 'nfts') {
                return { ...res, name: 'nfts' };
              }
              return res;
            });
            setInitialFields(tmp);
            setFilters(tmp1);
          } else {
            setInitialFields(iniFields);
            setFilters(target2);
          }
          setFields(fieldsTarget);
          setTemplatedata(target);
        }
      }
    }
    // else {
    //   return History.push('/home');
    // }
  }, [templatesList, routeParams.id]);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const disableButton = () => {
    setIsFormValid(false);
  };

  const enableButton = () => {
    setIsFormValid(true);
  };

  const options = [];

  const handleSubmit = () => {
    const data = {
      id: templateData.id,
      uuid: templateData.uuid,
      params:
        templateData.entity_type === 'nft_offers'
          ? { command: templateData.entity_type, ...form, nfts: [form.nfts] }
          : { command: templateData.entity_type, ...form },
      entity_type: templateData.entity_type
    };
    // console.log(data);
    dispatch(generateReport(data)).then((res) => {
      // console.log(res);
      if (res.payload && res.payload.length != 0) {
        setValue('2');
      }
    });
  };

  const downloadCSV = () => {
    const data = {
      id: templateData.id,
      uuid: templateData.uuid,
      params:
        templateData.entity_type === 'nft_offers'
          ? { command: templateData.entity_type, ...form, nfts: [form.nfts] }
          : { command: templateData.entity_type, ...form },
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

  const dbSync = () => {
    const data = {
      id: templateData.id,
      uuid: templateData.uuid,
      params:
        templateData.entity_type === 'nft_offers'
          ? { command: templateData.entity_type, ...form, nfts: [form.nfts] }
          : { command: templateData.entity_type, ...form },
      entity_type: templateData.entity_type
    };
    // db_data: JSON.stringify(reportList)
    // console.log(data);
    dispatch(databaseSync(data)).then((res) => {
      if (res && res.payload && res.payload.status) {
        // console.log(res.payload);
      }
    });
  };

  const entityData = entityList.find((res) => res.method === templateData?.entity_type);
  let codeFields = {};
  filters.map((res) => {
    const field = res.name;
    return (codeFields = {
      ...codeFields,
      [field]: form[field] ? form[field] : field === 'accounts' || field === 'nfts' ? [] : ''
    });
  });

  const codeString = `
  Type: POST
  Api:  ${window.location.origin}/${entityData?.connector}/${entityData?.route}/csv   

  Headers: {'token': 'your authorization token'}

  Request: 
    {
      id: ${templateData.id},
      uuid: ${templateData.uuid},
      params: ${
        templateData.entity_type === 'nft_offers'
          ? JSON.stringify({
              command: templateData.entity_type,
              ...codeFields,
              nfts: form.nfts ? [form.nfts] : []
            })
          : JSON.stringify({
              command: templateData.entity_type,
              ...codeFields
            })
      },
      entity_type: ${templateData.entity_type}
    }

  Response:
    Status Code: 200 ok
    Data: File

  `;

  return (
    <div className={classes.root}>
      <CssBaseline />
      {templateData && (
        <>
          <Box
            sx={{
              width: '100%',
              height: 65,
              backgroundColor: 'primary.dark'
            }}>
            <Grid
              container
              direction="row"
              justifyContent={'space-between'}
              sx={{ p: 1.5, mt: 0.5 }}>
              <Grid item>
                <Typography color="primary.contrastText" variant="h5" fontWeight={'bold'}>
                  Generate report - {templateData.report_name}
                </Typography>
              </Grid>
              <Grid sx={{ mr: 2 }} item>
                <Tooltip title="Edit Template" arrow>
                  <IconButton
                    onClick={() =>
                      History.push({ pathname: '/new_report', state: { ...templateData } })
                    }
                    sx={{
                      color: 'primary.contrastText',
                      '&:hover': { color: 'primary.main', backgroundColor: 'primary.contrastText' }
                    }}>
                    <Icon>edit</Icon>
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
          {loading3 ? <LinearProgress color="warning" /> : <Box sx={{ py: 0.25 }} />}
          <Box sx={{ width: '100%', p: 2 }}>
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
                            {res.name === 'accounts' ? (
                              <>
                                <Autocomplete
                                  multiple
                                  freeSolo
                                  options={options}
                                  value={form.accounts ? form.accounts : []}
                                  onChange={(event, newValue) => {
                                    setForm({ ...form, accounts: newValue });
                                  }}
                                  renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                      <Chip
                                        key={index}
                                        variant="outlined"
                                        label={option}
                                        {...getTagProps({ index })}
                                      />
                                    ))
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="outlined"
                                      fullWidth
                                      label={'Accounts *'}
                                      id={res.name}
                                      name={res.name}
                                      placeholder="Type the account number and enter."
                                      InputLabelProps={{
                                        shrink: true
                                      }}
                                    />
                                  )}
                                />
                                {templateData.entity_type === 'account_info' && (
                                  <Typography variant="caption" color={theme.palette.grey[600]}>
                                    Eg: rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B,
                                    rGHUsVMdDCC3o16SY1M7GcDcgf7BpmyZTq
                                  </Typography>
                                )}
                                {templateData.entity_type === 'account_nfts' && (
                                  <Typography variant="caption" color={theme.palette.grey[600]}>
                                    Eg: rLwTZj2HLFiB8Xwr56PnHiU8x7oRaWzRAA
                                  </Typography>
                                )}
                              </>
                            ) : res.name === 'nfts' ? (
                              <>
                                {/* <Autocomplete
                                  // multiple
                                  freeSolo
                                  options={options}
                                  value={form.nfts ? form.nfts : []}
                                  onChange={(event, newValue) => {
                                    setForm({ ...form, nfts: newValue });
                                  }}
                                  renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                      <Chip
                                        key={index}
                                        variant="outlined"
                                        label={option}
                                        {...getTagProps({ index })}
                                      />
                                    ))
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="outlined"
                                      fullWidth
                                      label={'Nfts *'}
                                      id={res.name}
                                      name={res.name}
                                      InputLabelProps={{
                                        shrink: true
                                      }}
                                    />
                                  )}
                                /> */}

                                <TextFieldFormsy
                                  label={'Nfts'}
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
                                <br />
                                <Typography variant="caption" color={theme.palette.grey[600]}>
                                  Eg:
                                  00080000D2344EF1B1BE252A728BEA07AF2803B7BA55D1D644B17C9E00000003
                                </Typography>
                              </>
                            ) : (
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
                            )}
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
                      sx={{ mt: 1, mb: 0, px: 4 }}
                      type="submit"
                      // fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      disabled={
                        !isFormValid ||
                        loading1 ||
                        (templateData.entity_type === 'account_info' && !form.accounts)
                      }
                      aria-label="Register"
                      style={{ textTransform: 'capitalize', fontSize: '16px' }}>
                      {loading1 ? <CircularProgress size={24} color="inherit" /> : 'Request Report'}
                    </Button>
                  </Box>
                </Formsy>
              </TabPanel>
              <TabPanel value="2">
                <Paper sx={{ width: '100%', mb: 2 }}>
                  {(templateData.property_type === 'File Generation' ||
                    templateData.property_type === 'Api' ||
                    templateData.property_type === 'Database Sync') && (
                    <Grid
                      container
                      direction="row"
                      sx={{ mb: 2 }}
                      justifyContent={'space-between'}
                      alignItems={'baseline'}>
                      <Grid item></Grid>
                      <Grid item>
                        {((templateData.property_type === 'File Generation' &&
                          templateData.file_generation === 'CSV') ||
                          templateData.property_type === 'Api') && (
                          <Button
                            sx={{ mx: 2, color: theme.palette.primary.contrastText, mt: 1 }}
                            variant="contained"
                            color="primary"
                            onClick={() => downloadCSV()}
                            type="button">
                            {loading1 ? (
                              <>
                                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
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
                            onClick={() => dbSync()}
                            startIcon={<Icon>sync</Icon>}
                            color="primary"
                            type="button">
                            {loading1 ? (
                              <>
                                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                <span>DB Sync</span>
                              </>
                            ) : (
                              'DB Sync'
                            )}
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
                      <Table sx={{ minWidth: 750 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            {fields
                              .sort((a, b) => a.order - b.order)
                              .map((row, i) => (
                                <TableCell sx={{ textTransform: 'capitalize' }} key={i + 'header'}>
                                  <Typography noWrap>{row.display_name}</Typography>
                                </TableCell>
                              ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reportList.map((row, i) => (
                            <TableRow
                              key={i + 'list'}
                              sx={{
                                '&:last-child td, &:last-child th': { border: 0 }
                              }}>
                              {Object.keys(row).map((key, index) => {
                                const fdata = fields.find((res) => res.display_name === key);
                                // console.log(fdata);
                                const type = fdata ? fdata.type : null;
                                return type && type === 'Boolean' ? (
                                  <TableCell key={row[key] + index + 'body' + i}>
                                    {row[key] ? 'Yes' : 'No'}
                                  </TableCell>
                                ) : key === 'time' ? (
                                  <TableCell key={i + index + 'body'}>
                                    {row[key] && (
                                      <Typography noWrap>
                                        {moment(row[key]).format('DD-MMM-YYYY HH:MM:SS')}
                                      </Typography>
                                    )}
                                  </TableCell>
                                ) : (
                                  <TableCell key={i + index + 'body'}>
                                    {row[key] &&
                                      (fdata && fdata.field === 'Date(Tx)' ? (
                                        <Typography noWrap>
                                          {moment.unix(row[key]).format('DD-MM-YYYY HH:mm')}
                                        </Typography>
                                      ) : (
                                        <Typography noWrap>
                                          {fdata && fdata.xrp_drops ? row[key] / 1000000 : row[key]}
                                        </Typography>
                                      ))}
                                  </TableCell>
                                );
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
          {templateData?.property_type === 'Api' && (
            <Box sx={{ width: '100%', pl: 5, pr: 4 }}>
              <Paper sx={{ width: '100%', mb: 2 }}>
                <Grid
                  container
                  direction="row"
                  sx={{ mx: 2 }}
                  justifyContent={'center'}
                  alignItems={'center'}>
                  <Grid item>
                    <Typography
                      variant="h6"
                      fontWeight={'bold'}
                      color={'primary'}
                      sx={{ p: 1, ml: 1 }}>
                      Api Details
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  sx={{ mx: 2 }}
                  justifyContent={'space-between'}
                  alignItems={'baseline'}>
                  <Grid sm={12} item>
                    <Typography variant="h6">1. Download CSV:</Typography>
                  </Grid>
                  <Grid sx={{ mx: 2, width: '95.5%' }} item>
                    <SyntaxHighlighter
                      wrapLines={true}
                      // wrapLongLines={true}
                      language="javascript"
                      style={docco}>
                      {codeString}
                    </SyntaxHighlighter>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          )}
        </>
      )}
    </div>
  );
};

export default ReportView;
