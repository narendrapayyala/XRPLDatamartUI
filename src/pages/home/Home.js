import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { makeStyles } from '@mui/styles';
// import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux';
import { getEntityList, getTemplatesList } from '../../store/reports/reportsSlice';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import lodash from '../../configurations/@lodash';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: '20px'
    // minHeight: '100vh',
    // window.innerHeight
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(0)
  }
}));

const Home = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const templatesList = useSelector(({ reports }) => reports.templatesList);
  const entityList = useSelector(({ reports }) => reports.entityList);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Entities');
  const [filteredData, setFilteredData] = useState(null);

  // console.log(templatesList, entityList);
  useEffect(() => {
    dispatch(getEntityList());
    dispatch(getTemplatesList());
  }, []);

  useEffect(() => {
    const getFilteredArray = () => {
      if (searchText.length === 0 && selectedCategory === 'All Entities') {
        const target = lodash.groupBy(templatesList, 'entity_type');
        return target;
      }
      const tmp = templatesList.filter((item) => {
        if (selectedCategory !== 'All Entities' && item.entity_type !== selectedCategory) {
          return false;
        }
        return templatesList;
      });
      if (searchText.length != 0) {
        const target1 = tmp.filter((item) =>
          item.report_name.toLowerCase().includes(searchText.toLowerCase())
        );
        const target2 = lodash.groupBy(target1, 'entity_type');
        return target2;
      }
      const target = lodash.groupBy(tmp, 'entity_type');
      return target;
    };

    if (templatesList) {
      setFilteredData(getFilteredArray());
    }
  }, [templatesList, searchText, selectedCategory]);

  const handleSearchText = (event) => {
    setSearchText(event.target.value);
  };

  const handleSelectedCategory = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Grid
        container
        direction="row"
        sx={{ mb: 2, p: 2 }}
        justifyContent="space-between"
        alignItems="baseline">
        <Grid xs={12} md={4} item>
          <TextField
            label="Search"
            sx={{ width: '100%' }}
            placeholder="Search..."
            name={'search'}
            id={'search'}
            value={searchText}
            inputProps={{
              'aria-label': 'Search'
            }}
            onChange={handleSearchText}
            variant="outlined"
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>
        <Grid xs={12} md={4} item></Grid>
        <Grid xs={12} md={4} sx={{ mt: 1 }} item>
          <FormControl sx={{ width: '100%' }} variant="outlined">
            <InputLabel id="category-label-placeholder">Entity Type </InputLabel>
            <Select
              value={selectedCategory}
              onChange={handleSelectedCategory}
              labelId="category-label-placeholder"
              id="demo-simple-select"
              label="Entity Type">
              <MenuItem value={'All Entities'}>All Entities</MenuItem>
              {entityList.map((res) => (
                <MenuItem sx={{ textTransform: 'capitalize' }} value={res.method} key={res.method}>
                  {res.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {filteredData &&
        Object.keys(filteredData).map((key, i) => (
          <Box key={i}>
            <Grid
              container
              direction="row"
              sx={{ mb: 2, p: 2 }}
              justifyContent="space-between"
              alignItems="baseline">
              <Grid xs={12} item>
                <Typography color="primary" variant="h6" sx={{ textTransform: 'capitalize' }}>
                  {entityList.find((res) => res.method === key).name}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              spacing={1}
              sx={{ mb: 1 }}
              justifyContent="space-arround"
              alignItems="baseline">
              {filteredData[key].map((res, index) => (
                <Grid
                  key={res.treport_name + key + index}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  sx={{ mt: 1 }}
                  item>
                  <Card sx={{ maxWidth: 250 }} onClick={() => console.log(res)}>
                    <CardActionArea>
                      <CardMedia component="img" image={'xrp-logo.png'} alt={res.report_name} />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {res.report_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {res.property_type} - {res.file_generation}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
    </div>
  );
};

export default Home;
