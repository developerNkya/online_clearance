package com.example.scannerapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

//        The textfields and buttons
        EditText editText = findViewById(R.id.idEdtUserName);
        EditText editPassword= findViewById(R.id.idEdtPassword);
        Button button = findViewById(R.id.idBtnLogin);


        button.setOnClickListener(
                new View.OnClickListener()
                {
                    public void onClick(View view)
                    {
                        String string = editText.getText().toString();
                        String userPass = editPassword.getText().toString();


                        String url1 = "http://onlineclearance.atwebpages.com/login.php?firstname=" + string + "&password=" + userPass;
                        GetMethodDemo GetMethodDemo = new GetMethodDemo(); // can add params for a constructor if needed
                        new GetMethodDemo().execute(url1);


                    }

                });}



    public class GetMethodDemo extends AsyncTask<String , Void ,String>
    {
        String server_response;
        Context mContext;





        @Override
        protected String doInBackground(String... strings) {

            URL url;
            HttpURLConnection urlConnection = null;




            try {
                url = new URL(strings[0]);
                urlConnection = (HttpURLConnection) url.openConnection();

                int responseCode = urlConnection.getResponseCode();

                if(responseCode == HttpURLConnection.HTTP_OK){
                    server_response = readStream(urlConnection.getInputStream());
                    Log.v("CatalogClient", server_response);
                }

            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }

            return null;
        }

        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);

            Log.e("Response", "" + server_response);

            //returning toast message::







            try
            {



                JSONObject jObj = new JSONObject(server_response);
                if (jObj.getInt("status") == 1)
                {
                    System.out.println("Login success");

                    Log.e("status", "" + "Allowed");

                    //toast




                    Intent intent = new Intent(MainActivity.this, scan_Page.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    MainActivity.this.startActivity(intent);



                }
                else
                {
                    //System.out.println("Login fail");

                    Log.e("status", "" + "Denied");

                    Toast.makeText(MainActivity.this, "Incorrect credidentials...Try again!", Toast.LENGTH_LONG).show();

                }
            }

            catch (JSONException e)
            {}

        }











// Converting InputStream to String

        private String readStream(InputStream in) {
            BufferedReader reader = null;
            StringBuffer response = new StringBuffer();
            try {
                reader = new BufferedReader(new InputStreamReader(in));
                String line = "";
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                if (reader != null) {
                    try {
                        reader.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
            return response.toString();


        }




    }
}