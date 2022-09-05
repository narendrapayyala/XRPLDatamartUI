import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { TextFieldFormsy } from './formsy';
import Checkbox from '@mui/material/Checkbox';
import { updateFieldsList } from '../store/reports/reportsSlice';
import { useDispatch } from 'react-redux';

const SelectFields = (props) => {
  const { fields, handleChange, fieldsData, isSearch, cmpkey, filters, activeStep, updateStatus } =
    props;
  const theme = useTheme();
  const fieldsNewData = useSelector(({ reports }) => reports.fieldsList);

  const [search, setSearch] = useState('');
  const [fieldsList, setFieldsList] = useState(fieldsData);
  const [allFieldsList] = useState(fieldsData);
  const dispatch = useDispatch();

  const isSelected = (field) => fields.indexOf(field) !== -1;

  const handleClick = (event, field) => {
    const selectedIndex = fields.indexOf(field);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(fields, field);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(fields.slice(1));
    } else if (selectedIndex === fields.length - 1) {
      newSelected = newSelected.concat(fields.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        fields.slice(0, selectedIndex),
        fields.slice(selectedIndex + 1)
      );
    }

    handleChange(newSelected);
  };

  useEffect(() => {
    if (filters) {
      let target = updateStatus ? [...fields] : [];
      if (!updateStatus) {
        fieldsList.map((n) => {
          if (n.required) {
            target.push(n.name);
          }
        });
      }
      handleChange(target);
      return;
    }
  }, [filters]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = fieldsList.map((n) => n.field || n.name);
      handleChange(newSelecteds);
      return;
    }
    handleChange([]);
  };

  const handleSearch = (data) => {
    setSearch(data);
    if (data === '' || data.length > 1) {
      if (activeStep === 1) {
        const target = allFieldsList.filter((item) =>
          item.field.toLowerCase().includes(data.toLowerCase())
        );
        setFieldsList(target);
      } else if (activeStep === 2) {
        const target = allFieldsList.filter((item) =>
          item.name.toLowerCase().includes(data.toLowerCase())
        );
        setFieldsList(target);
      }
    }
  };

  const handleDsiplayName = (value, fi) => {
    let data = [...fieldsNewData];
    data = data.map((res) => {
      if (res.field === fi) {
        return { ...res, display_name: value };
      } else {
        return { ...res };
      }
    });
    dispatch(updateFieldsList(data));
  };

  return (
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
      {isSearch && (
        <Grid container direction="row" sx={{ mb: 2 }} justifyContent="center" alignItems="center">
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
      )}

      <TableContainer>
        <Table sx={{ minWidth: 750 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  color="primary"
                  disabled={filters}
                  indeterminate={fields.length > 0 && fields.length < fieldsList.length}
                  checked={fieldsList.length > 0 && fields.length === fieldsList.length}
                  onChange={handleSelectAllClick}
                  inputProps={{
                    'aria-label': 'select all'
                  }}
                />
              </TableCell>
              <TableCell>Field</TableCell>
              {/* {entity_type && entity_type === 'account_info' && (
                <TableCell align="right">Entity</TableCell>
              )} */}
              {!filters && <TableCell sx={{ whiteSpace: 'nowrap' }}>Display Name</TableCell>}
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fieldsList.map((res, i) => {
              const isItemSelected = isSelected(res.field || res.name);
              const labelId = `${cmpkey}-${i}`;

              return (
                <TableRow
                  key={res.field + i + labelId + res.method}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  selected={isItemSelected}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:nth-of-type(odd)': {
                      backgroundColor: fields.length === 0 ? theme.palette.action.hover : ''
                    }
                  }}>
                  <TableCell>
                    <Checkbox
                      disabled={filters ? res.required : false}
                      color="primary"
                      onClick={(event) =>
                        filters && res.required ? '' : handleClick(event, res.field || res.name)
                      }
                      checked={isItemSelected}
                      inputProps={{
                        'aria-labelledby': labelId
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{res.field || res.name}</TableCell>
                  {/* {entity_type && entity_type === 'account_info' && (
                    <TableCell>{res.method === 'account_info' ? 'Acc' : 'Tx'}</TableCell>
                  )} */}
                  {!filters && (
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {isItemSelected ? (
                        <TextFieldFormsy
                          id={res.display_name}
                          name={res.display_name}
                          value={res.display_name}
                          onChange={(e) => handleDsiplayName(e.target.value, res.field)}
                          error={res.display_name === ''}
                          variant="outlined"
                          size="small"
                          fullWidth
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      ) : (
                        <>{res.display_name}</>
                      )}
                    </TableCell>
                  )}
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{res.type}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{res.description}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default SelectFields;
